import Resources from "../models/Resources.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export const getAllResources = async (req, res) => {
  try {
    const { category, search, tags, sortBy } = req.query;
    
    let query = {
      status: "active",
      isPublic: true,
    };
    
    if (category && category !== "all") query.category = category;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (tags) {
      const tagsArray = tags.split(",").map((t) => t.trim());
      query.tags = { $in: tagsArray };
    }
    
    let sort = {};
    switch (sortBy) {
      case "popular":
        sort = { downloads: -1, views: -1 };
        break;
      case "liked":
        sort = { likes: -1 };
        break;
      case "recent":
      default:
        sort = { createdAt: -1 };
    }

    const resources = await Resources.find(query)
      .populate("uploadedBy", "name email avatar")
      .populate("comments.user", "name avatar")
      .sort(sort)
      .limit(100);

    // ✅ SAFETY CHECK: Ensure uploadedBy exists
    const safeResources = resources.map(resource => {
      const resourceObj = resource.toObject();
      
      // Ensure uploadedBy exists and has avatar
      if (!resourceObj.uploadedBy) {
        resourceObj.uploadedBy = {
          _id: "unknown",
          name: "Unknown User",
          email: "",
          avatar: null,
        };
      } else {
        resourceObj.uploadedBy.avatar = resourceObj.uploadedBy.avatar || null;
      }

      // Ensure comments have safe user data
      if (resourceObj.comments && Array.isArray(resourceObj.comments)) {
        resourceObj.comments = resourceObj.comments.map(comment => ({
          ...comment,
          user: comment.user ? {
            ...comment.user,
            avatar: comment.user.avatar || null
          } : {
            _id: "unknown",
            name: "Unknown User",
            avatar: null,
          },
        }));
      }

      return resourceObj;
    });

    res.status(200).json({
      success: true,
      count: safeResources.length,
      resources: safeResources,
    });
  } catch (error) {
    console.error("Get resources error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch resources",
      details: error.message,
    });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resources.findById(id)
      .populate("uploadedBy", "name email avatar skills")
      .populate("comments.user", "name avatar")
      .populate("likes", "name avatar");

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    resource.views += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Get resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch resource",
      details: error.message,
    });
  }
};

export const uploadResource = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: "Title, description, and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "File is required",
      });
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    let fileType = "other";
    if (["pdf"].includes(fileExtension)) fileType = "pdf";
    else if (["doc", "docx"].includes(fileExtension)) fileType = "doc";
    else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension))
      fileType = "image";
    else if (["mp4", "avi", "mov"].includes(fileExtension)) fileType = "video";
    else if (["zip", "rar"].includes(fileExtension)) fileType = "zip";

    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "resources",
        resource_type: "auto",
      });
      fs.unlinkSync(req.file.path);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        success: false,
        error: "Failed to upload file",
      });
    }
    const resource = await Resources.create({
      title,
      description,
      category,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
      fileUrl: uploadResult.secure_url,
      fileType,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
    });

    const populatedResource = await Resources.findById(resource._id).populate(
      "uploadedBy",
      "name email avatar"
    );

    res.status(201).json({
      success: true,
      message: "Resource uploaded successfully",
      resource: populatedResource,
    });
  } catch (error) {
    console.error("Upload resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload resource",
      details: error.message,
    });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const resource = await Resources.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this resource",
      });
    }

    if (updates.tags) {
      updates.tags = Array.isArray(updates.tags)
        ? updates.tags
        : updates.tags.split(",").map((t) => t.trim());
    }

    const updatedResource = await Resource.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("uploadedBy", "name email avatar");

    res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      resource: updatedResource,
    });
  } catch (error) {
    console.error("Update resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update resource",
      details: error.message,
    });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resources.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    if (
      resource.uploadedBy.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this resource",
      });
    }

    await Resources.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete resource",
      details: error.message,
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const resource = await Resources.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    const likeIndex = resource.likes.indexOf(userId);

    if (likeIndex > -1) {
      resource.likes.splice(likeIndex, 1);
    } else {
      resource.likes.push(userId);
    }

    await resource.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? "Resource unliked" : "Resource liked",
      likes: resource.likes.length,
      isLiked: likeIndex === -1,
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to toggle like",
      details: error.message,
    });
  }
};

export const trackDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resources.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    resource.downloads += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      message: "Download tracked",
      downloads: resource.downloads,
    });
  } catch (error) {
    console.error("Track download error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to track download",
      details: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Comment text is required",
      });
    }

    const resource = await Resources.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Resource not found",
      });
    }

    resource.comments.push({
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    });

    await resource.save();

    const updatedResource = await Resources.findById(id).populate(
      "comments.user",
      "name avatar"
    );

    res.status(200).json({
      success: true,
      message: "Comment added",
      comments: updatedResource.comments,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add comment",
      details: error.message,
    });
  }
};

export const getMyResources = async (req, res) => {
  try {
    const userId = req.user._id;

    const resources = await Resources.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email avatar");

    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Get my resources error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch your resources",
      details: error.message,
    });
  }
};

export const getResourceStats = async (req, res) => {
  try {
    const [totalResources, totalDownloads, topCategories] = await Promise.all([
      Resources.countDocuments({ status: "active" }),
      Resources.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: null, total: { $sum: "$downloads" } } },
      ]),
      Resources.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalResources,
        totalDownloads: totalDownloads[0]?.total || 0,
        topCategories,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stats",
      details: error.message,
    });
  }
};
