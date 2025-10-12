import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desctiption: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["In-Person", "Online", "Hybrid"],
      default: "In-Person",
    },
    organizerName: {
      type: String,
      trim: true,
      default: "",
    },
    organizerEmail: {
      type: String,
      trim: true,
      default: "",
    },
    prizes: {
      type: String,
      default: "",
    },
    expectedParticipants: {
      type: String,
      default: "",
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
      default: null,
    },
    websiteUrl: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    requirements: {
      tyoe: String,
      default: "",
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
hackathonSchema.index({ startDate: 1 });
hackathonSchema.index({ registrationOpen: 1 });
hackathonSchema.index({ tags: 1 });

export default mongoose.model("Hackathon", hackathonSchema);
