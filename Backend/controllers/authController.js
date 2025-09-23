import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const allowedDomains = ["college.edu", "students.college.edu","kiet.edu","iit.edu","nit.edu"];
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
