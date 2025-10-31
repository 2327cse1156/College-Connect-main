import express from "express";
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
  logout,
  validateResetToken,
  adminAddAlumni
} from "../controllers/authController.js";
import {upload} from "../middlewares/upload.js"
import { validateSignup,validateLogin } from "../middlewares/validate.js";
import { adminOnly, protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", upload.single("studentId"), validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/validate-token", validateResetToken)

router.post("/admin/add-alumni", protect, adminOnly, adminAddAlumni);

export default router;
