import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Notes",
      "Books",
      "Projects",
      "Tutorials",
      "Interview Prep",
      "Research Papers",
      "Other",
    ],
  },
  tags: {
    type: [String],
    default: [],
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ["pdf", "doc", "docx", "image", "video", "zip", "other"],
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downloads: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isPublic: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["active", "archived", "flagged"],
    default: "active",
  },
},{timestamps:true});

resourceSchema.index({ category: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ createdAt: -1 });
resourceSchema.index({ likes: 1 });

resourceSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

export default mongoose.model("Resource", resourceSchema);