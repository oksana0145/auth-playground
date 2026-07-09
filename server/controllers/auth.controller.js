import bcrypt from 'bcrypt';
import User from "../models/User.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.js";

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
        return res.status(200).json({
            message: "Login successful",
            user: user._id,
            firstName: user.firstName,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
        },
    );
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Server error",
        });
    }
};