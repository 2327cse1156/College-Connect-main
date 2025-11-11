import User from "../models/User.js";

export const getAlumni = async (req, res) => {
  try {
    const { search, college, graduationYear, skills } = req.query;
    let query = {
      role: "alumni",
      verificationStatus: "approved",
    };

    if (search) {
      query.$or = [
        {
          name: { $regex: search, $options: "i" },
        },
        {
          email: { $regex: search, $options: "i" },
        },
      ];
    }

    if (college) {
      query.college = {
        $regex: college,
        $options: "i",
      };
    }

    if (graduationYear) {
      query.graduationYear = parseInt(graduationYear);
    }

    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      query.skills = { $in: skillsArray };
    }

    const alumni = await User.find(query)
      .select("-password -__v -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: alumni.length,
      alumni,
    });
  } catch (error) {
    console.error("Get alumni error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alumni",
      details: error.message,
    });
  }
};

export const getSeniors = async (req, res) => {
  try {
    const { search, college, branch, skills } = req.query;

    let query = {
      role: "senior",
      verificationStatus: "approved",
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (college) {
      query.college = { $regex: college, $options: "i" };
    }

    if (branch) {
      query.branch = { $regex: branch, $options: "i" };
    }

    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      query.skills = { $in: skillsArray };
    }

    const seniors = await User.find(query)
      .select("-password -__v -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: seniors.length,
      seniors,
    });
  } catch (error) {
    console.error("Get seniors error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch seniors",
      details: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "-password -__v -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user profile",
      details: error.message,
    });
  }
};

export const getAvailableMentors = async (req, res) => {
  try {
    const { skills, role } = req.query;
    
    let query = {
      role: { $in: ["alumni", "senior"] },
      verificationStatus: "approved"
    };

    if (role && (role === "alumni" || role === "senior")) {
      query.role = role;
    }

    if (skills) {
      const skillsArray = skills.split(",").map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    const mentors = await User.find(query)
      .select("name email role avatar skills bio college yearOfGraduation course branch location activities")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    console.error("Get mentors error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch mentors",
      details: error.message,
    });
  }
};

export const getNetworkStats = async (req, res) => {
  try {
    const [alumniCount, seniorCount, totalMentors] = await Promise.all([
      User.countDocuments({ role: "alumni", verificationStatus: "approved" }),
      User.countDocuments({ role: "senior", verificationStatus: "approved" }),
      User.countDocuments({ 
        role: { $in: ["alumni", "senior"] }, 
        verificationStatus: "approved" 
      }),
    ]);
    const topSkills = await User.aggregate([
      { 
        $match: { 
          role: { $in: ["alumni", "senior"] },
          verificationStatus: "approved"
        } 
      },
      { $unwind: "$skills" },
      { $group: { _id: "$skills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const colleges = await User.distinct("college", {
      role: { $in: ["alumni", "senior"] },
      verificationStatus: "approved",
    });

    res.status(200).json({
      success: true,
      stats: {
        alumniCount,
        seniorCount,
        totalMentors,
        topSkills: topSkills.map(s => ({ skill: s._id, count: s.count })),
        collegesCount: colleges.filter(c => c).length,
      },
    });
  } catch (error) {
    console.error("Get network stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch network stats",
      details: error.message,
    });
  }
};
