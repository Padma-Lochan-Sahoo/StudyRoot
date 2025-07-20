import express from 'express';
import { signup, login, logout, verifyotp, checkAuth, forgotPassword, verifyPasswordResetOtp, resetPassword } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.moddleware.js';



const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/verify-otp",verifyotp)

// Password reset routes
router.post("/forgot-password", forgotPassword)
router.post("/verify-password-reset-otp", verifyPasswordResetOtp)
router.post("/reset-password", resetPassword)

router.get("/check",protectRoute,checkAuth)
export default router;