import express from "express";
import {authMiddleware} from "../middlewares/auth.js"
import {adminMiddleware} from "../middlewares/adminMiddleware.js"
import { autoUpgradeRoles, getUpgradePreview } from "../controllers/roleTransition.js";
const router = express.Router()
router.use(authMiddleware);
router.use(adminMiddleware)

router.get("/preview", getUpgradePreview);

router.post("/upgrade", autoUpgradeRoles);

export default router;