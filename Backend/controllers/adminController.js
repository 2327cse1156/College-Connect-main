import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      verificationStatus: "pending",
      role: "student",
    })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (error) {
    console.error("Get pending users error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch pending users",
      details: error.message,
    });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.verificationStatus === "approved") {
      return res.status(400).json({
        error: "User already approved",
      });
    }
    user.verificationStatus = "approved";
    user.verifiedBy = adminId;
    user.verificationDate = new Date();
    await user.save();
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "🎉 Your CollegeConnect Account is Approved!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Congratulations, ${user.name}! 🎓</h2>
            <p>Great news! Your CollegeConnect account has been verified and approved.</p>
            
            <div style="background: #10B981; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="margin: 0;">✅ Account Status: APPROVED</h3>
            </div>
            
            <p>You can now:</p>
            <ul>
              <li>Login to your account</li>
              <li>Find hackathon teammates</li>
              <li>Connect with seniors and alumni</li>
              <li>Share and access resources</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/login" 
                 style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Login Now
              </a>
            </div>
             <p style="color: #6B7280; font-size: 14px;">
              Welcome to the CollegeConnect community!<br/>
              - CollegeConnect Team
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Email send error:", error);
    }
    res.status(200).json({
      success: true,
      message: "User approved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to approve user",
      details: error.message,
    });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;
    if (!reason || reason.trim() === "") {
      return res.status(400).json({ error: "Rejection reason is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.verificationStatus === "approved") {
      return res.status(400).json({ error: "Cannot reject an approved user" });
    }
    user.verificationStatus = "rejected";
    user.rejectionReason = reason;
    user.verifiedBy = adminId;
    user.verificationDate = new Date();
    await user.save();
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "CollegeConnect Account Verification Update",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #DC2626;">Account Verification Status</h2>
            <p>Hello ${user.name},</p>
            <p>We've reviewed your CollegeConnect account application.</p>
            
            <div style="background: #FEE2E2; border-left: 4px solid #DC2626; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #DC2626; margin: 0 0 10px 0;">Account Not Approved</h3>
              <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
            </div>
            
            <p>If you believe this is a mistake or need further clarification, please:</p>
            <ul>
              <li>Reply to this email with your concerns</li>
              <li>Provide additional verification documents if needed</li>
              <li>Contact our support team</li>
            </ul>
            
            <p style="color: #6B7280; font-size: 14px;">
              Thank you for your understanding.<br/>
              - CollegeConnect Team
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
    }

    res.status(200).json({
      success: true,
      message: "User rejected successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        verificationStatus: user.verificationStatus,
        rejectionReason: user.rejectionReason,
      },
    });
  } catch (error) {
    console.error("Reject user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reject user",
      details: error.message,
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, pendingCount, approvedCount, rejectedCount] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ verificationStatus: "pending" }),
        User.countDocuments({ verificationStatus: "approved" }),
        User.countDocuments({ verificationStatus: "rejected" }),
      ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        pendingCount,
        approvedCount,
        rejectedCount,
        recentRegistrations,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stats",
      details: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { status, role, search } = req.query;
    let query = {};
    if (status) {
      query.verificationStatus = status;
    }
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      details: error.message,
    });}
};
