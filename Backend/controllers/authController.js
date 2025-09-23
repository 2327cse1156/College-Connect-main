import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


// Signup controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const allowedDomains = [
      "college.edu",
      "students.college.edu",
      "kiet.edu",
      "iit.edu",
      "nit.edu",
    ];
    if (role === "student") {
      const emailDomain = email.split("@")[1];
      if (!allowedDomains.includes(emailDomain)) {
        return res.status(400).json({
          error: "Kindly use a valid college email address",
        });
      }
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user.token = token;
    await user.save();
    return res.status(201).json({
      token,
      user,
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Signup failed",
      details: error.message,
    });
  }
};

// Login controller

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user.token = token;

    return res.status(200).json({
      token,
      user,
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Login failed",
      details: error.message,
    });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET, 
      { expiresIn: "1h" }
    );

    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ error: "Token and new password are required" });

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token has expired" });
    }
    res.status(400).json({ error: "Invalid token" });
  }
};


export const validateToken = async (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, process.env.JWT_RESET_SECRET);
    res.status(200).json({ valid: true });
  } catch {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};


