import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    studentUrl: {
      type: String,
      default: "",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verificationDate: {
      type: Date,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["student", "senior", "alumni", "admin"],
      default: "student",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String, // Cloudinary URL
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    yearOfAdmission: {
      type: String, // e.g. "2021"
      default: "",
    },
    yearOfGraduation: {
      type: String, // e.g. "2025"
      default: "",
    },
    course: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      default: "",
    },
    college: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
      default: "",
    },

    // Other optional details
    website: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    activities: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        type: {
          type: String,
          enum: ["code", "work", "achievement"],
          default: "code",
        },
      },
    ],

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.index({ verificationStatus: 1 });
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
