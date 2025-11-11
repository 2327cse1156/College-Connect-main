import multer from "multer";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "avatar") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Avatar must be an image"), false);
    }
  }
  if (file.fieldname === "resume") {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.mimetype)) {
      return cb(new Error("Resume must be PDF or DOC/DOCX"), false);
    }
  }
  if (file.fieldname === "studentId") {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "image/jpg",
    ];
    if (!validTypes.includes(file.mimetype)) {
      return cb(new Error("Student ID must be an image or PDF"), false);
    }
  }
  cb(null, true);
};

// Export multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
