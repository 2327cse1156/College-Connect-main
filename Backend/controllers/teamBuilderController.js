import TeamRequest from "../models/TeamRequest.js";
import User from "../models/User.js";

// ✅ Get all team requests with filters
export const getAllTeamRequests = async (req, res) => {
  try {
    const { search, event, status, skills } = req.query;

    let query = {};

    // Search by title or event
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { event: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by event
    if (event) {
      query.event = { $regex: event, $options: "i" };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by skills needed
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      query.skillsNeeded = { $in: skillsArray };
    }

    const teamRequests = await TeamRequest.find(query)
      .populate("createdBy", "name email avatar")
      .populate("teamMembers", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: teamRequests.length,
      teamRequests,
    });
  } catch (error) {
    console.error("Get team requests error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch team requests",
      details: error.message,
    });
  }
};

// ✅ Get single team request by ID
export const getTeamRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const teamRequest = await TeamRequest.findById(id)
      .populate("createdBy", "name email avatar skills bio")
      .populate("teamMembers", "name email avatar skills")
      .populate("applications.user", "name email avatar skills");

    if (!teamRequest) {
      return res.status(404).json({
        success: false,
        error: "Team request not found",
      });
    }

    res.status(200).json({
      success: true,
      teamRequest,
    });
  } catch (error) {
    console.error("Get team request error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch team request",
      details: error.message,
    });
  }
};

// ✅ Create team request
export const createTeamRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      event,
      eventType,
      skillsNeeded,
      spotsAvailable,
      deadline,
      tags,
      hackathonId,
    } = req.body;

    if (!title || !description || !event || !skillsNeeded || !spotsAvailable) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const teamRequest = await TeamRequest.create({
      title,
      description,
      event,
      eventType: eventType || "hackathon",
      skillsNeeded: Array.isArray(skillsNeeded)
        ? skillsNeeded
        : skillsNeeded.split(",").map((s) => s.trim()),
      spotsAvailable,
      createdBy: req.user._id,
      deadline: deadline ? new Date(deadline) : null,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [],
      hackathonId: hackathonId || null,
    });

    const populatedRequest = await TeamRequest.findById(
      teamRequest._id
    ).populate("createdBy", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Team request created successfully",
      teamRequest: populatedRequest,
    });
  } catch (error) {
    console.error("Create team request error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create team request",
      details: error.message,
    });
  }
};

// ✅ Update team request (only by creator)
export const updateTeamRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const teamRequest = await TeamRequest.findById(id);

    if (!teamRequest) {
      return res.status(404).json({
        success: false,
        error: "Team request not found",
      });
    }

    // Check if user is the creator
    if (teamRequest.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this request",
      });
    }

    // Update allowed fields
    if (updates.skillsNeeded) {
      updates.skillsNeeded = Array.isArray(updates.skillsNeeded)
        ? updates.skillsNeeded
        : updates.skillsNeeded.split(",").map((s) => s.trim());
    }

    if (updates.tags) {
      updates.tags = Array.isArray(updates.tags)
        ? updates.tags
        : updates.tags.split(",");
    }

    const updatedRequest = await TeamRequest.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Team request updated successfully",
      teamRequest: updatedRequest,
    });
  } catch (error) {
    console.error("Update team request error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update team request",
      details: error.message,
    });
  }
};

// ✅ Delete team request (only by creator)
export const deleteTeamRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const teamRequest = await TeamRequest.findById(id);

    if (!teamRequest) {
      return res.status(404).json({
        success: false,
        error: "Team request not found",
      });
    }

    // Check if user is the creator
    if (teamRequest.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this request",
      });
    }

    await TeamRequest.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Team request deleted successfully",
    });
  } catch (error) {
    console.error("Delete team request error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete team request",
      details: error.message,
    });
  }
};

// ✅ Apply to join team
export const applyToTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    const teamRequest = await TeamRequest.findById(id);

    if (!teamRequest) {
      return res.status(404).json({
        success: false,
        error: "Team request not found",
      });
    }

    if (teamRequest.status !== "open") {
      return res.status(400).json({
        success: false,
        error: "This team request is no longer accepting applications",
      });
    }

    // Check if user is the creator
    if (teamRequest.createdBy.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        error: "You cannot apply to your own team request",
      });
    }

    // Check if already applied
    const existingApplication = teamRequest.applications.find(
      (app) => app.user.toString() === userId.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: "You have already applied to this team",
      });
    }

    // Check if already a team member
    if (teamRequest.teamMembers.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: "You are already a member of this team",
      });
    }

    // Add application
    teamRequest.applications.push({
      user: userId,
      message: message || "",
      status: "pending",
      appliedAt: new Date(),
    });

    await teamRequest.save();

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      teamRequest,
    });
  } catch (error) {
    console.error("Apply to team error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to apply to team",
      details: error.message,
    });
  }
};

// ✅ Accept/Reject application (only by creator)
export const handleApplication = async (req, res) => {
  try {
    const { id, applicationId } = req.params;
    const { action } = req.body; // "accept" or "reject"

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        error: "Invalid action. Must be 'accept' or 'reject'",
      });
    }

    const teamRequest = await TeamRequest.findById(id);

    if (!teamRequest) {
      return res.status(404).json({
        success: false,
        error: "Team request not found",
      });
    }

    // Check if user is the creator
    if (teamRequest.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to manage applications",
      });
    }

    const application = teamRequest.applications.id(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      });
    }

    if (action === "accept") {
      if (teamRequest.spotsAvailable <= 0) {
        return res.status(400).json({
          success: false,
          error:
            "No spots available to accept new members. This team is already full.",
        });
      }
      // Add to team members
      teamRequest.teamMembers.push(application.user);
      application.status = "accepted";

      // Decrease spots available
    teamRequest.spotsAvailable -= 1;

      // Close request if no spots left
      if (teamRequest.spotsAvailable === 0) {
        teamRequest.status = "closed";
      }
    } else {
      application.status = "rejected";
    }

    await teamRequest.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Application ${action}ed successfully`,
      teamRequest,
    });
  } catch (error) {
    console.error("Handle application error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to handle application",
      details: error.message,
    });
  }
};

// ✅ Get my team requests (created by me)
export const getMyTeamRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const myRequests = await TeamRequest.find({ createdBy: userId })
      .populate("teamMembers", "name email avatar")
      .populate("applications.user", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: myRequests.length,
      teamRequests: myRequests,
    });
  } catch (error) {
    console.error("Get my team requests error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch your team requests",
      details: error.message,
    });
  }
};

// ✅ Get my applications (teams I applied to)
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await TeamRequest.find({
      "applications.user": userId,
    })
      .populate("createdBy", "name email avatar")
      .populate("teamMembers", "name email avatar")
      .sort({ createdAt: -1 });

    // Filter to show only my applications
    const myApplications = requests.map((req) => {
      const myApp = req.applications.find(
        (app) => app.user.toString() === userId.toString()
      );
      return {
        ...req.toObject(),
        myApplication: myApp,
      };
    });

    res.status(200).json({
      success: true,
      count: myApplications.length,
      applications: myApplications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch your applications",
      details: error.message,
    });
  }
};
