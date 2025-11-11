import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { upload } from "../middlewares/upload.js";
import {
  getAllHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  registerForHackathon,
  unregisterFromHackathon,
} from "../controllers/hackathonController.js";

const router = express.Router();

router.get("/", getAllHackathons);
router.get("/:id", getHackathonById);

router.post("/:id/register", authMiddleware, registerForHackathon);
router.post("/:id/unregister", authMiddleware, unregisterFromHackathon);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createHackathon
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateHackathon
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteHackathon);

export default router;
