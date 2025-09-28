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
  if (file.fieldname === "avatar" && !file.mimetype.startsWith("image/")) {
    return cb(new Error("Avatar must be an image"), false);
  }
  if (
    file.fieldname === "resume" &&
    !["application/pdf", "application/msword"].includes(file.mimetype)
  ) {
    return cb(new Error("Resume must be PDF or DOC"), false);
  }
  cb(null, true);
};

// Export multer instance
export const upload = multer({ storage, fileFilter });
