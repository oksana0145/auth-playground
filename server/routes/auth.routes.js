import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  getMe,
  refresh,
  logout,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/verify-email", verifyEmail);

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.post("/resend-verification", resendVerificationEmail);

export default router;
