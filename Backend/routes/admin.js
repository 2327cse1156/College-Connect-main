import express from "express";
import { authMiddleware}  from "../middlewares/auth.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import {approveUser, deleteUser, getAdminStats, getAllUsers, getPendingUsers, rejectUser} from "../controllers/adminController.js"
const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/pending-users", getPendingUsers);
router.post("/approve/:userId",approveUser);
router.post("/reject/:userId",rejectUser);
router.get("/stats",getAdminStats);
router.get("/users",getAllUsers);
router.delete("/users/:userId",deleteUser);

export default router;