import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
        }
    );
};