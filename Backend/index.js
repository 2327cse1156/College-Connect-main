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

dotenv.config();
connectDB();
const app = express();

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
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.use("/api/auth", auth);
app.use("/api/profile", profileRoutes);

app.listen(PORT, () => {
  console.log(`SERVER RUNNING SUCCESSFULLY on port ${PORT}`);
});
