import express from "express";
import { login, signup,forgotPassword,resetPassword,validateToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login",login)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/validate-token", validateToken);

export default router;
