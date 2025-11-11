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
    personalEmail: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
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
    admissionYear: {
      type: Number,
      required: function () {
        return (
          this.role === "student" ||
          this.role === "senior" ||
          this.role === "alumni"
        );
      },
    },
    graduationYear: {
      type: Number,
      required: function () {
        return (
          this.role === "student" ||
          this.role === "senior" ||
          this.role === "alumni"
        );
      },
    },
    currentYear: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    roleLastUpdated: {
      type: Date,
      default: Date.now,
    },

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
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    location: {
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
    course: {
      type: String,
      default: "",
    },
    college: {
      type: String,
      default: "",
    },
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
    resumeUrl: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    activities: {
      type: Array,
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// INDEXES
// ============================================
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ verificationStatus: 1 });
userSchema.index({ graduationYear: 1 });
userSchema.index({ admissionYear: 1 });

// ============================================
// VIRTUAL: Current Year Display
// ============================================
userSchema.virtual("currentYearDisplay").get(function () {
  const year = this.currentYear;
  if (year >= 5) return "Graduated";
  const suffixes = ["th", "st", "nd", "rd"];
  const v = year % 100;
  return `${year}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]} Year`;
});

// ============================================
// STATIC METHOD: Calculate Year from Admission
// ============================================
userSchema.statics.calculateYearFromAdmission = function (
  admissionYear,
  graduationYear
) {
  if (!admissionYear || !graduationYear) return 1;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  // Calculate years since admission
  // Academic year typically starts in July/August (month 6/7)
  let yearsSinceAdmission = currentYear - admissionYear;

  // If we're before August, subtract 1 year
  if (currentMonth < 7) {
    yearsSinceAdmission -= 1;
  }

  // Current year should be yearsSinceAdmission + 1
  // Example: Admitted 2023, Current 2025 Oct → 2025-2023=2, +1 = 3rd year ✅
  const calculatedYear = yearsSinceAdmission + 1;

  // Ensure it's between 1 and 5
  return Math.max(1, Math.min(calculatedYear, 5));
};

// ============================================
// METHOD: Calculate Current Academic Year
// ============================================
userSchema.methods.calculateCurrentYear = function () {
  return this.constructor.calculateYearFromAdmission(
    this.admissionYear,
    this.graduationYear
  );
};

// ============================================
// METHOD: Check if user needs role update
// ============================================
userSchema.methods.needsRoleUpdate = function () {
  if (!this.admissionYear || !this.graduationYear) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Check if graduated (after July of graduation year)
  const hasGraduated =
    currentYear > this.graduationYear ||
    (currentYear === this.graduationYear && currentMonth >= 6);

  // Calculate current academic year
  const calculatedYear = this.calculateCurrentYear();

  // Determine expected role
  let expectedRole;
  if (hasGraduated) {
    expectedRole = "alumni";
  } else if (calculatedYear >= 4) {
    expectedRole = "senior";
  } else {
    expectedRole = "student";
  }

  // Check if role or year needs update
  return this.role !== expectedRole || this.currentYear !== calculatedYear;
};

// ============================================
// METHOD: Update role if needed
// ============================================
userSchema.methods.updateRoleIfNeeded = async function () {
  if (!this.admissionYear || !this.graduationYear) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Check if graduated
  const hasGraduated =
    currentYear > this.graduationYear ||
    (currentYear === this.graduationYear && currentMonth >= 6);

  // Calculate current academic year
  const calculatedYear = this.calculateCurrentYear();

  const oldRole = this.role;
  const oldYear = this.currentYear;
  let updated = false;

  // Update role based on academic progress
  if (hasGraduated) {
    if (this.role !== "alumni" || this.currentYear !== 5) {
      this.role = "alumni";
      this.currentYear = 5;
      updated = true;
    }
  } else if (calculatedYear >= 4) {
    if (this.role !== "senior" || this.currentYear !== calculatedYear) {
      this.role = "senior";
      this.currentYear = calculatedYear;
      updated = true;
    }
  } else {
    if (this.role !== "student" || this.currentYear !== calculatedYear) {
      this.role = "student";
      this.currentYear = calculatedYear;
      updated = true;
    }
  }

  if (updated) {
    this.roleLastUpdated = new Date();
    await this.save();

    return {
      updated: true,
      oldRole,
      newRole: this.role,
      oldYear,
      currentYear: this.currentYear,
    };
  }

  return false;
};

// ============================================
// MIDDLEWARE: Set currentYear on creation
// ============================================
userSchema.pre("save", function (next) {
  // On new user creation, calculate currentYear
  if (this.isNew && this.admissionYear && this.graduationYear) {
    this.currentYear = this.constructor.calculateYearFromAdmission(
      this.admissionYear,
      this.graduationYear
    );

    if (this.role !== "alumni") {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const hasGraduated =
        currentYear > this.graduationYear ||
        (currentYear === this.graduationYear && currentMonth >= 6);

      if (hasGraduated) {
        this.role = "alumni";
        this.currentYear = 5;
      } else if (this.currentYear >= 4) {
        this.role = "senior";
      } else {
        this.role = "student";
      }
    }
  }

  next();
});

// Set virtuals to be included in JSON
userSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.createdAt = doc.createdAt;
    ret.updatedAt = doc.updatedAt;
    return ret;
  },
});

userSchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.createdAt = doc.createdAt;
    ret.updatedAt = doc.updatedAt;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;

