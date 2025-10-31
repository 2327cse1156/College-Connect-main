import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// GET /profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ success: true, user:{
      ...user.toObject(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
};

// PUT /profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Parse skills if sent as string
    let skills = req.body.skills;
    if (typeof skills === "string") {
      try {
        skills = JSON.parse(skills);
      } catch {
        skills = skills.split(",").map((s) => s.trim());
      }
    }
    let activities = req.body.activities;
if (typeof activities === "string") {
  try {
    activities = JSON.parse(activities);
  } catch {
    activities = [];
  }
}

    // Collect text fields
    const updates = {
      name: req.body.name,
      bio: req.body.bio,
      skills: skills || [],
      location: req.body.location,
      yearOfAdmission: req.body.yearOfAdmission,
      yearOfGraduation: req.body.yearOfGraduation,
      course: req.body.course,
      branch: req.body.branch,
      college: req.body.college,
      website: req.body.website,
      linkedin: req.body.linkedin,
      github: req.body.github,
      activities: activities || [],
    };

    // Upload avatar
    if (req.files?.avatar?.[0]) {
      const uploadedAvatar = await cloudinary.uploader.upload(
        req.files.avatar[0].path,
        { folder: "avatars" }
      );
      updates.avatar = uploadedAvatar.secure_url;
      fs.unlinkSync(req.files.avatar[0].path);
    }

    // Upload resume
    if (req.files?.resume?.[0]) {
      const uploadedResume = await cloudinary.uploader.upload(
        req.files.resume[0].path,
        { folder: "resumes", resource_type: "raw" }
      );
      updates.resumeUrl = uploadedResume.secure_url;
      fs.unlinkSync(req.files.resume[0].path);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
};
