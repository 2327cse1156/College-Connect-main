import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -_v");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server error", details: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, bio, skills, avatar, location } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, skills, avatar, location },
      { new: true, runValidators: true }
    ).select("-password -_v");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server error", details: error.message });
  }
};
