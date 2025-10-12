import Hackathon from "../models/Hackathon.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const getAllHackathons = async (req, res) => {
  try {
    const { type, search, upcoming } = req.query;

    let query = {};
    if (type && type !== "all") {
      query.type = type;
    }

    if (upcoming === "true") {
      query.startDate = { $gte: new Date() };
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const hackathons = await Hackathon.find(query)
      .sort({ startDate: 1 })
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: hackathons.length,
      hackathons,
    });
  } catch (error) {
    console.error("Get hackathons error : ", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch hackathons",
      details: error.message,
    });
  }
};
