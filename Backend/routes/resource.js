import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { upload } from "../middlewares/upload.js";
import {
  getAllResources,
  getResourceById,
  uploadResource,
  updateResource,
  deleteResource,
  toggleLike,
  trackDownload,
  addComment,
  getMyResources,
  getResourceStats,
} from "../controllers/resourceController.js";

const router = express.Router();


router.get("/", getAllResources);
router.get("/stats", getResourceStats);
router.get("/:id", getResourceById);


router.use(authMiddleware);


router.post("/:id/like", toggleLike);
router.post("/:id/download", trackDownload);
router.post("/:id/comment", addComment);


router.post("/", adminMiddleware, upload.single("file"), uploadResource);
router.put("/:id", adminMiddleware, updateResource);
router.delete("/:id", adminMiddleware, deleteResource);
router.get("/my/uploads", adminMiddleware, getMyResources);

export default router;