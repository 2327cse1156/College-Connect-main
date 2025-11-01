import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auth from "./routes/auth.js";
import cookieParser from "cookie-parser";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin.js";
import roleTranstionRoutes from "./routes/roleTransition.js";
import hackathonRoutes from "./routes/hackathon.js";
import networkRoutes from "./routes/network.js";
import teamBuilderRoutes from "./routes/teamRoutes.js";
import resourceRoutes from "./routes/resource.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { createServer } from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chat.js"

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", auth);
app.use("/api/admin", adminRoutes);
app.use("/api/role-transition", roleTranstionRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/team-builder", teamBuilderRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/chat", chatRoutes)

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.use("/api/profile", profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Online users tracking
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 User Connected:", socket.id);

  // User comes online
  socket.on("user:online", (userId) => {
    socket.userId = userId; // Store userId in socket for disconnect
    onlineUsers.set(userId, socket.id);
    
    // ✅ FIXED: Changed to "users:online" (plural)
    io.emit("users:online", Array.from(onlineUsers.keys()));
    console.log(`✅ User ${userId} is online. Total online:`, onlineUsers.size);
  });

  // Join conversation room
  socket.on("join:conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`📥 Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Send message
  socket.on("message:send", (data) => {
    const { conversationId, message } = data;
    io.to(conversationId).emit("message:received", message);
    console.log(`💬 Message sent to conversation ${conversationId}`);
  });

  // Typing indicators
  socket.on("typing:start", (data) => {
    const { conversationId, userId, userName } = data;
    socket.to(conversationId).emit("typing:user", { userId, userName });
  });

  socket.on("typing:stop", (data) => {
    const { conversationId, userId } = data;
    socket.to(conversationId).emit("typing:stop", { userId });
  });

  // User disconnects
  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
    
    // Remove from online users using stored userId
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit("users:online", Array.from(onlineUsers.keys()));
      console.log(`❌ User ${socket.userId} removed. Total online:`, onlineUsers.size);
    }
  });

  // Manual offline event (optional, for explicit logout)
  socket.on("user:offline", (userId) => {
    onlineUsers.delete(userId);
    io.emit("users:online", Array.from(onlineUsers.keys()));
    console.log(`👋 User ${userId} went offline manually`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 SERVER RUNNING on port ${PORT}`);
  console.log(`🔌 Socket.IO ready for connections`);
});