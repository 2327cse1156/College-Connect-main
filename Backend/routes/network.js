import express from "express";

import { authMiddleware } from "../middlewares/auth.js";
import { getAlumni, getAvailableMentors, getNetworkStats, getSeniors, getUserProfile } from "../controllers/networkController.js";

const router = express.Router();

router.get("/alumni", getAlumni);
router.get("/seniors", getSeniors);
router.get("/mentors",getAvailableMentors);
router.get("/stats", getNetworkStats);

router.get("/user/:userId",authMiddleware,getUserProfile);

export default router;