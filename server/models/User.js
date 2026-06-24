import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: {
        type: String, 
        required: true,
    },
    role: {
        type: String, 
        default: "user",
    }, 
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationTokenExpires: {
        type: Date,
    },
    refreshToken: {
        type: String,
    },    
    },
    {
    timestamps: true,
    });

    const User = mongoose.model("User", userSchema);

    export default User;
