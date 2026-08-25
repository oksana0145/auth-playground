import { Router } from "express";
import { register, verifyEmail, login, getMe, refresh, logout, } from "../controllers/auth.controller.js";
import { sendVerificationEmail } from "../utils/email.js";
import { protect } from "../middleware/auth.middleware.js"

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

router.get("/verify-email", verifyEmail);

router.get("/protected-test", protect, (req, res) => {
    return res.status(200).json({
        message: "Protected route works",
        user: req.user,
    });
});

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);

router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;