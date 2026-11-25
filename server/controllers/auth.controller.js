import bcrypt from "bcrypt";
import User from "../models/User.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import {
  refreshCookieOptions,
  REFRESH_COOKIE_MAX_AGE,
} from "../config/cookies.js";

const VERIFICATION_TOKEN_LIFETIME = 24 * 60 * 60 * 1000;

const createEmailVerificationData = () => {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_LIFETIME),
  };
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Enter a valid email address",
      });
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase letter and one number",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const { token, expiresAt } = createEmailVerificationData();

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      passwordHash,
      emailVerificationToken: token,
      emailVerificationTokenExpires: expiresAt,
      isEmailVerified: false,
    });

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const verificationEmailSent = await sendVerificationEmail(
      user.email,
      verificationLink,
    )
      .then(() => true)
      .catch((emailError) => {
        console.error("Verification email failed:", emailError.message);
        return false;
      });

    return res.status(201).json({
      message: verificationEmailSent
        ? "User created successfully. Check your email to verify your account."
        : "Your account was created, but we couldn't send the verification email. Go to Sign in, enter your credentials, and request a new verification email.",
      verificationEmailSent,
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
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    console.error("Register error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
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
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before signing in.",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      ...refreshCookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE,
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
      "firstName lastName email role isEmailVerified",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
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
    console.error("Get current user error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
      });
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    const user = await User.findOne({
      _id: decodedToken.userId,
      refreshToken: refreshToken,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;

    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      ...refreshCookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    console.error("Refresh token error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(200).json({
        message: "Logout successful",
      });
    }

    const user = await User.findOne({
      refreshToken,
    });

    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.clearCookie("refreshToken", refreshCookieOptions);

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Enter a valid email address",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        message:
          "If an account with this email exists, a verification email has been sent.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const { token, expiresAt } = createEmailVerificationData();

    user.emailVerificationToken = token;
    user.emailVerificationTokenExpires = expiresAt;

    await user.save();

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await sendVerificationEmail(user.email, verificationLink);

    return res.status(200).json({
      message:
        "Verification email sent successfully. The link is valid for 24 hours.",
    });
  } catch (error) {
    console.error("Resend verification email error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
