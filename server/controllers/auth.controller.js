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