// ============================================
// Updated authController.js - SendGrid Integration
// ============================================

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail"; // ⭐ SendGrid import
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// ⭐ SendGrid Configuration (Replaces nodemailer)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ⭐ Helper function to send emails via SendGrid
const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL, // Must be verified in SendGrid
      subject,
      html,
    };
    
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error.message);
    return { success: false, error };
  }
};

// Token response helper
const sendTokenResponse = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

// ============================================
// SIGNUP
// ============================================
export const signup = async (req, res) => {
  console.log("🚀 === SIGNUP STARTED ===");
  try {
    const {
      name,
      email,
      password,
      role,
      admissionYear,
      graduationYear,
      passoutYear,
      personalEmail,
    } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const allowedDomains = [
      "college.edu",
      "students.college.edu",
      "kiet.edu",
      "iit.edu",
      "nit.edu",
    ];

    // Student validation
    if (role === "student") {
      const emailDomain = email.split("@")[1];
      if (!allowedDomains.includes(emailDomain))
        return res.status(400).json({
          error: "Students must use a valid college email",
        });

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

      if (!req.file) {
        return res.status(400).json({
          error: "Student ID card is required for verification",
        });
      }
    }

    // Alumni validation
    if (role === "alumni") {
      if (!passoutYear) {
        return res.status(400).json({
          error: "Passout/Graduation year is required for alumni",
        });
      }

      const passout = parseInt(passoutYear);
      const currentYear = new Date().getFullYear();

      if (isNaN(passout)) {
        return res.status(400).json({ error: "Invalid passout year format" });
      }

      if (passout > currentYear) {
        return res.status(400).json({
          error: "Passout year cannot be in the future",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "Degree certificate or Alumni ID is required for verification",
        });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload verification document
    let verificationDocUrl = "";
    if (req.file) {
      try {
        const folderName =
          role === "alumni" ? "alumni-documents" : "student-ids";
        const uploadedDoc = await cloudinary.uploader.upload(req.file.path, {
          folder: folderName,
          resource_type: "auto",
        });
        verificationDocUrl = uploadedDoc.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          error: "Failed to upload verification document",
        });
      }
    }

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      verificationStatus: "pending",
      studentIdUrl: verificationDocUrl,
      isAdmin: false,
    };

    if (role === "student") {
      userData.admissionYear = parseInt(admissionYear);
      userData.graduationYear = parseInt(graduationYear);
      userData.currentYear = 1;
    } else if (role === "alumni") {
      userData.graduationYear = parseInt(passoutYear);
      userData.admissionYear = parseInt(passoutYear) - 4;
      userData.currentYear = 5;
      userData.role = "alumni";

      if (personalEmail && personalEmail !== email) {
        userData.personalEmail = personalEmail;
      }
    }

    const user = await User.create(userData);

    if (role === "student" && admissionYear && graduationYear) {
      await user.updateRoleIfNeeded();
    }

    // ⭐ Send welcome email via SendGrid
    const emailSubject =
      role === "alumni"
        ? "Welcome Alumni - CollegeConnect Account Under Review"
        : "Welcome to CollegeConnect - Account Under Review";

    const emailBody =
      role === "alumni"
        ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">Welcome Back, ${name}! 🎓</h2>
          <p>Your alumni account has been created successfully.</p>
          <div style="background: #D1FAE5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Account Status:</strong> <span style="color: #F59E0B;">Pending Verification</span></p>
            <p style="margin: 5px 0 0 0;"><strong>Passout Year:</strong> ${passoutYear}</p>
          </div>
          <p>Our admin team will verify your alumni status within 24-48 hours.</p>
          <br/>
          <p style="color: #6B7280;">Thanks,<br/>CollegeConnect Team</p>
        </div>
      `
        : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to CollegeConnect, ${name}! 🎓</h2>
          <p>Your account has been created successfully.</p>
          <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Account Status:</strong> <span style="color: #F59E0B;">Pending Verification</span></p>
            <p style="margin: 5px 0 0 0;"><strong>Admission Year:</strong> ${admissionYear}</p>
            <p style="margin: 5px 0 0 0;"><strong>Expected Graduation:</strong> ${graduationYear}</p>
          </div>
          <p>Our admin team will review your student ID and verify your account within 24-48 hours.</p>
          <br/>
          <p style="color: #6B7280;">Thanks,<br/>CollegeConnect Team</p>
        </div>
      `;

    // Send email (non-blocking)
    sendEmail(user.email, emailSubject, emailBody);

    const token = sendTokenResponse(res, user);

    res.status(201).json({
      success: true,
      message:
        role === "alumni"
          ? "Alumni account created! Please wait for admin verification."
          : "Account created! Please wait for admin verification.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        admissionYear: user.admissionYear,
        graduationYear: user.graduationYear,
        currentYear: user.currentYear,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Signup failed",
      details: error.message,
    });
  }
};

// ============================================
// LOGIN
// ============================================
export const login = async (req, res) => {
  console.log("🔵 === LOGIN STARTED ===");
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
          `Role auto-updated for ${user.email}: ${roleUpdate.oldRole} → ${roleUpdate.newRole}`
        );
      }
    }

    const token = sendTokenResponse(res, user);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
      details: error.message,
    });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Logout failed",
      details: error.message,
    });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.FRONTEND_URL}/reset-password?token=${token}`
        : `http://localhost:5173/reset-password?token=${token}`;

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail(user.email, "Password Reset Request", emailBody);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// RESET PASSWORD
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

// VALIDATE RESET TOKEN
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

// ADMIN ADD ALUMNI
export const adminAddAlumni = async (req, res) => {
  try {
    const { name, email, personalEmail, passoutYear, branch, course } =
      req.body;

    if (!name || !email || !passoutYear) {
      return res.status(400).json({
        error: "Name, email, and passout year are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const tempPassword = Math.random().toString(36).slice(-8) + "Pass@123";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const alumni = await User.create({
      name,
      email,
      personalEmail: personalEmail || email,
      password: hashedPassword,
      role: "alumni",
      verificationStatus: "approved",
      graduationYear: parseInt(passoutYear),
      admissionYear: parseInt(passoutYear) - 4,
      currentYear: 5,
      branch: branch || "",
      course: course || "",
      isAdmin: false,
    });

    const loginUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.FRONTEND_URL}/login`
        : "http://localhost:5173/login";

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Welcome to CollegeConnect Alumni Network! 🎓</h2>
        <p>Hi ${name},</p>
        <p>Your alumni account has been created by the admin team.</p>
        
        <div style="background: #EEF2FF; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Login Credentials:</strong></p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" 
             style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Login Now
          </a>
        </div>
        
        <p>Welcome to the community!</p>
        <p style="color: #6B7280;">- CollegeConnect Team</p>
      </div>
    `;

    await sendEmail(alumni.email, "Welcome to CollegeConnect Alumni Network", emailBody);

    res.status(201).json({
      success: true,
      message: "Alumni added successfully",
      alumni: {
        _id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        role: alumni.role,
        passoutYear: alumni.graduationYear,
      },
      tempPassword,
    });
  } catch (error) {
    console.error("Admin add alumni error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add alumni",
      details: error.message,
    });
  }
};

// ⭐ Export sendEmail for use in other controllers
export { sendEmail };