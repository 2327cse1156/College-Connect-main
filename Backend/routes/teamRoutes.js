import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getAllTeamRequests,
  getTeamRequestById,
  createTeamRequest,
  updateTeamRequest,
  deleteTeamRequest,
  applyToTeam,
  handleApplication,
  getMyTeamRequests,
  getMyApplications,
} from "../controllers/teamBuilderController.js";

const router = express.Router();


router.get("/", getAllTeamRequests);
router.get("/:id", getTeamRequestById);


router.use(authMiddleware);

router.post("/", createTeamRequest);
router.put("/:id", updateTeamRequest);
router.delete("/:id", deleteTeamRequest);
router.post("/:id/apply", applyToTeam);
router.post("/:id/applications/:applicationId", handleApplication);
router.get("/my/requests", getMyTeamRequests);
router.get("/my/applications", getMyApplications);

export default router;