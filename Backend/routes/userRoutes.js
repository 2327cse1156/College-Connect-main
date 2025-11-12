// routes/userRoutes.js - CREATE THIS FILE

import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import User from "../models/User.js";

const router = express.Router();

// @route   GET /api/users/:userId
// @desc    Get user profile by ID
// @access  Private (logged in users)
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -verificationToken -resetPasswordToken");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        college: user.college,
        course: user.course,
        branch: user.branch,
        skills: user.skills,
        location: user.location,
        website: user.website,
        linkedin: user.linkedin,
        github: user.github,
        resumeUrl: user.resumeUrl,
        admissionYear: user.admissionYear,
        graduationYear: user.graduationYear,
        currentYear: user.currentYear,
        verificationStatus: user.verificationStatus,
        activities: user.activities,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;