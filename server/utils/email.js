import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (
    userEmail,
    verificationLink
) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Verify your email",
        text: `Please verify your email by clicking the link: ${verificationLink}`,
    });
};