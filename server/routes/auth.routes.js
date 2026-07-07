import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { sendVerificationEmail } from "../utils/email.js";

const router = Router();

router.get("/test", (req, res) => {
    res.json({message: "Auth routes work"});
});

router.get("/test-email", async (req,res) => {
    await sendVerificationEmail(
        process.env.EMAIL_USER,
        "http://localhost:5173/verify-email?token=test-token"
    );

    res.json({message: "Test email sent"});
})

router.post("/register", register);

export default router;