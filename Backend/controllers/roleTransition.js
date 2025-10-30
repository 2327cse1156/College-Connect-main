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

export const autoUpgradeRoles = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    let upgradedCount = 0;

    const studentsToSenior = await User.find({
      role: "student",
      verificationStatus: "approved",
      graduationYear: currentYear,
      currentYear: { $gte: 4 },
    });

    for (const user of studentsToSenior) {
      user.role = "senior";
      user.currentYear = 4;
      user.roleLastUpdated = new Date();
      await user.save();
      upgradedCount++;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "🎓 You're Now a Senior on CollegeConnect!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">Congratulations, ${user.name}! 🎉</h2>
              <p>Your role has been automatically updated to <strong>Senior</strong> as you're in your final year!</p>
              
              <div style="background: #EEF2FF; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;">✨ <strong>New Benefits:</strong></p>
                <ul>
                  <li>Mentor junior students</li>
                  <li>Share your experiences</li>
                  <li>Lead project teams</li>
                  <li>Connect with alumni network</li>
                </ul>
              </div>
              
              <p>Keep building amazing things!</p>
              <p style="color: #6B7280;">- CollegeConnect Team</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }
    }

    const seniorsToAlumni = await User.find({
      role: "senior",
      verificationStatus: "approved",
      graduationYear: { $lt: currentYear },
    });

    if (currentMonth >= 6) {
      const currentYearGraduates = await User.find({
        role: { $in: ["student", "senior"] },
        verificationStatus: "approved",
        graduationYear: currentYear,
      });
      seniorsToAlumni.push(...currentYearGraduates);
    }

    for (const user of seniorsToAlumni) {
      user.role = "alumni";
      user.currentYear = 5;
      user.roleLastUpdated = new Date();
      await user.save();
      upgradedCount++;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "🎓 Welcome to Alumni Network - CollegeConnect",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10B981;">Welcome to the Alumni Network, ${user.name}! 🎊</h2>
              <p>Congratulations on your graduation! Your role has been updated to <strong>Alumni</strong>.</p>
              
              <div style="background: #D1FAE5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>⚠️ Important: Update Your Email</strong></p>
                <p>Your college email may expire soon. Please add a personal email to your profile to stay connected!</p>
              </div>
              
              <div style="background: #EEF2FF; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;">🌟 <strong>Alumni Benefits:</strong></p>
                <ul>
                  <li>Mentor current students</li>
                  <li>Share career opportunities</li>
                  <li>Stay connected with college community</li>
                  <li>Attend alumni events</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5173/profile" 
                   style="background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Update Profile
                </a>
              </div>
              
              <p style="color: #6B7280;">Congratulations once again!<br/>- CollegeConnect Team</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }
    }

    const overdueStudents = await User.find({
      role: "student",
      verificationStatus: "approved",
      yearOfGraduation: { $lt: currentYear.toString() },
    });

    for (const user of overdueStudents) {
      user.role = "alumni";
      await user.save();
      upgradedCount++;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Role Updated to Alumni - CollegeConnect",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Role Update</h2>
              <p>Hi ${user.name},</p>
              <p>Your role has been updated to <strong>Alumni</strong> based on your graduation year.</p>
              <p>Please update your profile with a personal email address.</p>
              <p>- CollegeConnect Team</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }
    }

    res.status(200).json({
      success: true,
      message: `Role upgrade completed: ${upgradedCount} users upgraded`,
      details: {
        studentsToSenior: studentsToSenior.length,
        seniorsToAlumni: seniorsToAlumni.length,
        overdueStudents: overdueStudents.length,
      },
    });
    const allActiveStudents = await User.find({
      role: { $in: ["student", "senior"] },
      verificationStatus: "approved",
      admissionYear: { $exists: true },
      graduationYear: { $gte: currentYear },
    });

    for (const user of allActiveStudents) {
      const updated = await user.updateRoleIfNeeded();
      if (updated && updated.updated) {
        upgradedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Role upgrade completed: ${upgradedCount} users upgraded`,
      details: {
        studentToSenior: studentsToSenior.length,
        seniorToAlumni: seniorsToAlumni.length,
        totalUpgraded: upgradedCount,
      },
    });
  } catch (error) {
    console.error("Role upgrade error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upgrade roles",
      details: error.message,
    });
  }
};

export const getUpgradePreview = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const studentsToSenior = await User.countDocuments({
      role: "student",
      verificationStatus: "approved",
      yearOfGraduation: currentYear.toString(),
    });

    const seniorsToAlumni = await User.countDocuments({
      role: "senior",
      verificationStatus: "approved",
      yearOfGraduation: { $lt: currentYear.toString() },
    });

    const overdueStudents = await User.countDocuments({
      role: "student",
      verificationStatus: "approved",
      yearOfGraduation: { $lt: currentYear.toString() },
    });

    res.status(200).json({
      success: true,
      preview: {
        studentsToSenior,
        seniorsToAlumni,
        overdueStudents,
        totalToUpgrade: studentsToSenior + seniorsToAlumni + overdueStudents,
      },
    });
  } catch (error) {
    console.error("Preview error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get preview",
      details: error.message,
    });
  }
};
