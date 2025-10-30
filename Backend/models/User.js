// models/User.js
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
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "senior", "alumni", "admin"],
      default: "student",
    },
    
    // ============================================
    // NEW FIELDS FOR ROLE TRANSITION
    // ============================================
    admissionYear: {
      type: Number,
      required: function() {
        return this.role === 'student' || this.role === 'senior' || this.role === 'alumni';
      },
      default: function() {
        return new Date().getFullYear();
      },
    },
    graduationYear: {
      type: Number,
      required: function() {
        return this.role === 'student' || this.role === 'senior' || this.role === 'alumni';
      },
      default: function() {
        return new Date().getFullYear() + 4;
      },
    },
    currentYear: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
      // 1-4 = Student/Senior years, 5 = Alumni (graduated)
    },
    roleLastUpdated: {
      type: Date,
      default: Date.now,
    },
    
    // ============================================
    // EXISTING FIELDS
    // ============================================
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    studentIdUrl: {
      type: String,
      default: "",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    
    // Optional: Additional profile fields
    bio: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      default: "",
    },
    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ============================================
// INDEXES FOR BETTER QUERY PERFORMANCE
// ============================================
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ verificationStatus: 1 });
userSchema.index({ graduationYear: 1 });
userSchema.index({ admissionYear: 1 });

// ============================================
// VIRTUAL: Get ordinal suffix for current year
// ============================================
userSchema.virtual('currentYearDisplay').get(function() {
  const year = this.currentYear;
  if (year >= 5) return 'Graduated';
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = year % 100;
  return `${year}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]} Year`;
});

// ============================================
// METHOD: Check if user needs role update
// ============================================
userSchema.methods.needsRoleUpdate = function() {
  if (!this.admissionYear || !this.graduationYear) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  let yearsSinceAdmission = currentYear - this.admissionYear;
  if (currentMonth < 7) yearsSinceAdmission -= 1; // Before August
  
  const calculatedYear = Math.max(1, Math.min(yearsSinceAdmission + 1, 4));
  const hasGraduated = currentYear >= this.graduationYear && currentMonth >= 7;
  
  let expectedRole;
  if (hasGraduated) {
    expectedRole = 'alumni';
  } else if (calculatedYear >= 4) {
    expectedRole = 'senior';
  } else {
    expectedRole = 'student';
  }
  
  return this.role !== expectedRole;
};

// ============================================
// METHOD: Update role if needed
// ============================================
userSchema.methods.updateRoleIfNeeded = async function() {
  if (!this.needsRoleUpdate()) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  let yearsSinceAdmission = currentYear - this.admissionYear;
  if (currentMonth < 7) yearsSinceAdmission -= 1;
  
  const calculatedYear = Math.max(1, Math.min(yearsSinceAdmission + 1, 4));
  const hasGraduated = currentYear >= this.graduationYear && currentMonth >= 7;
  
  const oldRole = this.role;
  
  if (hasGraduated) {
    this.role = 'alumni';
    this.currentYear = 5;
  } else if (calculatedYear >= 4) {
    this.role = 'senior';
    this.currentYear = calculatedYear;
  } else {
    this.role = 'student';
    this.currentYear = calculatedYear;
  }
  
  this.roleLastUpdated = new Date();
  await this.save();
  
  return {
    updated: true,
    oldRole,
    newRole: this.role,
    currentYear: this.currentYear
  };
};

// ============================================
// MIDDLEWARE: Update role before login (optional)
// ============================================
userSchema.pre('save', async function(next) {
  // Only run on existing users, not on creation
  if (!this.isNew && this.isModified('admissionYear', 'graduationYear')) {
    await this.updateRoleIfNeeded();
  }
  next();
});

// Set virtuals to be included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;