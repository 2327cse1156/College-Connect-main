import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put(
  "/",
  authMiddleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);

export default router;
