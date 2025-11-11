import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@kiet.edu" });
    
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Deleting old admin...");
      await User.deleteOne({ email: "admin@kiet.edu" });
    }

    // Hash password properly
    const hashedPassword = await bcrypt.hash("admin123", 10);
    console.log("🔐 Password hashed successfully");

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@kiet.edu",
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
      verificationStatus: "approved",
      bio: "System Administrator",
      skills: [],
      activities: [],
      location: "",
      yearOfAdmission: "",
      yearOfGraduation: "",
      course: "",
      branch: "",
      college: "KIET",
      avatar: "",
      resumeUrl: "",
      website: "",
      linkedin: "",
      github: "",
      studentIdUrl: "",
      rejectionReason: "",
      verifiedBy: null,
      verificationDate: new Date(),
    });

    console.log("\n🎉 Admin user created successfully!");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password: admin123");
    console.log("✅ Role:", admin.role);
    console.log("✅ isAdmin:", admin.isAdmin);
    console.log("\n👉 You can now login with these credentials!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();