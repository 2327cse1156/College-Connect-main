import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to set HttpOnly cookie
const sendTokenCookie = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

// ---------------- SIGNUP (WITH STUDENT ID VERIFICATION) ----------------
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, admissionYear, graduationYear } =
      req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const allowedDomains = [
      "college.edu",
      "students.college.edu",
      "kiet.edu",
      "iit.edu",
      "nit.edu",
    ];

    // ✅ Student email + ID verification
    if (role === "student") {
      const emailDomain = email.split("@")[1];
      if (!allowedDomains.includes(emailDomain))
        return res
          .status(400)
          .json({ error: "Kindly use a valid college email" });

      if (!admissionYear || !graduationYear) {
        return res.status(400).json({
          error: "Admission year and graduation year are required for students",
        });
      }

      const admission = parseInt(admissionYear);
      const graduation = parseInt(graduationYear);

      if (isNaN(admission) || isNaN(graduation)) {
        return res.status(400).json({ error: "Invalid year format" });
      }

      if (graduation <= admission) {
        return res.status(400).json({
          error: "Graduation year must be after admission year",
        });
      }

      // ✅ Student ID is required
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "Student ID card is required for verification" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Upload student ID to Cloudinary
    let studentIdUrl = "";
    if (role === "student" && req.file) {
      try {
        const uploadedId = await cloudinary.uploader.upload(req.file.path, {
          folder: "student-ids",
          resource_type: "auto", // Supports images and PDFs
        });
        studentIdUrl = uploadedId.secure_url;
        fs.unlinkSync(req.file.path); // Delete temp file
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ error: "Failed to upload student ID" });
      }
    }

    // ✅ Create user with verification
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      verificationStatus: role === "student" ? "pending" : "approved",
      studentIdUrl: studentIdUrl,
      isAdmin: false,
      admissionYear: admissionYear ? parseInt(admissionYear) : undefined,
      graduationYear: graduationYear ? parseInt(graduationYear) : undefined,
      currentYear: 1,
    });
    if (role === "student" && admissionYear && graduationYear) {
      await user.updateRoleIfNeeded();
    }
    // ✅ Send welcome email for students
    if (role === "student") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Welcome to CollegeConnect - Account Under Review",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">Welcome to CollegeConnect, ${name}! 🎓</h2>
              <p>Your account has been created successfully.</p>
              <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Account Status:</strong> <span style="color: #F59E0B;">Pending Verification</span></p>
              </div>
              <p>Our admin team will review your student ID and verify your account within 24-48 hours.</p>
              <p>You'll receive an email once your account is approved.</p>
              <br/>
              <p style="color: #6B7280;">Thanks,<br/>CollegeConnect Team</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    }

    if (role !== "student") {
      sendTokenCookie(res, user);
    }

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        admissionYear: user.admissionYear,
        graduationYear: user.graduationYear,
        currentYear: user.currentYear,
      },
      success: true,
      message:
        role === "student"
          ? "Account created! Please wait for admin verification."
          : "User registered successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ success: false, error: "Signup failed", details: error.message });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    if (user.verificationStatus === "pending") {
      return res.status(403).json({
        error: "Account pending verification.",
        verificationStatus: "pending",
        message:
          "Your account is under review. Please wait for admin approval.",
      });
    }

    if (user.verificationStatus === "rejected") {
      return res.status(403).json({
        error: "Account verification rejected",
        verificationStatus: "rejected",
        rejectionReason:
          user.rejectionReason || "Please contact admin for details.",
        message: "Your account was not approved.",
      });
    }

    if (user.verificationStatus === "approved") {
      const roleUpdate = await user.updateRoleIfNeeded();
      if (roleUpdate && roleUpdate.updated) {
        console.log(
          `Role auto-updated for ${user.email}: ${roleUpdate.oldRole} →${roleUpdate.newRole}`
        );
      }
    }

    sendTokenCookie(res, user);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        isAdmin: user.isAdmin,
        admissionYear: user.admissionYear,
        graduationYear: user.graduationYear,
        currentYear: user.currentYear,
      },
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, error: "Login failed", details: error.message });
  }
};

// ---------------- LOGOUT ----------------
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Logout failed", details: error.message });
  }
};

// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, {
      expiresIn: "1h",
    });
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res
      .status(400)
      .json({ error: "Token and new password are required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(400).json({ error: "Token has expired" });
    res.status(400).json({ error: "Invalid token" });
  }
};
// Reset token

export const validateResetToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token has expired" });
    }
    return res.status(400).json({ error: "Invalid token" });
  }
};
