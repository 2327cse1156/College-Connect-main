import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/",authMiddleware,getProfile)
router.put("/",authMiddleware,updateProfile);

export default router;