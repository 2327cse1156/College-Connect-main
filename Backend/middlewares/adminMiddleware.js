import User from "../models/User.js";
export const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.isAdmin && user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied.Admon priviliges required.",
        message: "You don't have permission to access this resource.",
      });
    }
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      error: "Server error in admin verification",
    });
  }
};
