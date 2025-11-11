import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email avatar")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

export const getOrCreateConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user._id;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        error: "Participant ID is required",
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name" },
      });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, participantId],
      });
      conversation = await Conversation.findById(conversation._id).populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name" },
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Get or create conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get or create conversation",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, before } = req.query;

    let query = { conversation: conversationId };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate("sender", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

      res.status(200).json({
        success: true,
        messages: messages.reverse(),
      });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message content is required",
      });
    }

    // Check if conversation exists and user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      content: content.trim(),
      readBy: [userId], // Sender has read it
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = message.createdAt;
    await conversation.save();

    // Populate message
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email avatar"
    );

    // Emit socket event
    const io = req.app.get("io");
    io.to(conversationId).emit("message:received", populatedMessage);

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Mark all messages in conversation as read by this user
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId }, // Not sent by me
        readBy: { $ne: userId }, // Not already read by me
      },
      {
        $addToSet: { readBy: userId },
      }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark messages as read",
    });
  }
};