import express from "express";
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController.js";
import {upload} from "../middlewares/upload.js"

const router = express.Router();

router.post("/signup", upload.single("studentId"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
