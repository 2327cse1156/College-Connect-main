import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
export const authMiddleware = async (req, res, next) => {
  try {
    // ⭐ COOKIE AUR AUTHORIZATION HEADER DONO CHECK KARO
    let token = req.cookies?.token;

    // If no cookie, check Authorization header
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ error: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({
      success: false,
      error: "Authorization failed",
      details: error.message,
    });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Only ${allowedRoles.join(
            ", "
          )} can access this resource.`,
          userRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({
        success: false,
        error: "Authorization failed",
        details: error.message,
      });
    }
  };
};

export const verifiedOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (req.user.verificationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        error: "Your account must be verified to access this resource.",
        verificationStatus: req.user.verificationStatus,
      });
    }

    next();
  } catch (error) {
    console.error("Verification check error:", error);
    return res.status(500).json({
      success: false,
      error: "Verification check failed",
      details: error.message,
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    // ⭐ COOKIE AUR AUTHORIZATION HEADER DONO CHECK KARO
    let token = req.cookies?.token;
    
    // If no cookie, check Authorization header
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized. Please login first.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (exclude password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found. Please login again.",
      });
    }

    // Check if user is verified
    if (user.verificationStatus === "pending") {
      return res.status(403).json({
        success: false,
        error: "Your account is pending verification.",
        verificationStatus: "pending",
      });
    }

    if (user.verificationStatus === "rejected") {
      return res.status(403).json({
        success: false,
        error: "Your account verification was rejected.",
        verificationStatus: "rejected",
        rejectionReason: user.rejectionReason || "Contact admin for details",
      });
    }

    // ✅ Auto-update role if needed
    const roleUpdate = await user.updateRoleIfNeeded();
    if (roleUpdate && roleUpdate.updated) {
      console.log(
        `🔄 Role auto-updated for ${user.email}: ${roleUpdate.oldRole} → ${roleUpdate.newRole}`
      );
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token. Please login again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Session expired. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Authentication failed",
      details: error.message,
    });
  }
};
