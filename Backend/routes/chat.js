import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getConversations,
  getMessages,
  getOrCreateConversation,
  markAsRead,
  sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);

router.get("/conversations", getConversations);
router.post("/conversations", getOrCreateConversation);
router.get("/conversations/:conversationId/messages", getMessages);
router.post("/conversations/:conversationId/messages", sendMessage);
router.put("/conversations/:conversationId/read", markAsRead);

export default router;
