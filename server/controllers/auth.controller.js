import bcrypt from 'bcrypt';
import User from "../models/User.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const emailVerificationToken = crypto.randomBytes(32).toString("hex");
        const emailVerificationTokenExpires = new Date(
            Date.now() + 1000 * 60 * 60
        );

        const user = await User.create({
            firstName,
            lastName,
            email: normalizedEmail,
            passwordHash,
            emailVerificationToken,
            emailVerificationTokenExpires,
            isEmailVerified: false,
        });

        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;
        await sendVerificationEmail(user.email, verificationLink);

        return res.status(201).json({
            message: "User created successfully. Check your email to verify account.",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            }
        });
    } catch (error) {
        console.log("Register error:", error.message);

        return res.status(500).json({
            message: "Server error",
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Verification token is required",
            });
        }

        const user = await User.findOne({
            emailVerificationToken: token,
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid verification link",
            });
        }

        if ( 
            !user.emailVerificationTokenExpires ||
            user.emailVerificationTokenExpires < new Date()
        ) {
            return res.status(400).json({
                message: "Verification link has expired",
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error("Verify email error:", error.message);

        return res.status(500).json({
            message: "Server error",
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password.",
            })
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email before signing in.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user: { 
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Server error",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "firstName lastName email role"
        )

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })
        }

        return res.status(200).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Get current user error:", error.message)

        return res.status(500).json({
            message: "Server error",
        })
    }
}

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token is required",
            })
        }

        const decodedToken = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )

        const user = await User.findOne({
            _id: decodedToken.userId,
            refreshToken: refreshToken,
        })

        if (!user) {
            return res.status(401).json({
                message: "Invalid refresh token",
            })
        }

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        user.refreshToken = newRefreshToken

        await user.save()

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            accessToken: newAccessToken,
        })
} catch (error) {
    console.error("Refresh token error:", error.message)
    
    return res.status(401).json({
        message: "Invalid or expired refresh token",
    })
}
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(200).json({
                message: "Logout succesful",
            })
        }

        const user = await User.findOne({
            refreshToken,
        })

        if (user) {
            user.refreshToken = undefined
            await user.save()
        }

        res.clearCookie("refreshToken", {
            httpOnle: true,
            secure: false,
            sameSite: "lax",
        })

    return res.status(200).json({
        message: "Logout successful",
    })
    } catch (error) {
        console.error("Logout error:", error.message)

        return res.status(500).json({
            message: "Server error",
        })
    }
}