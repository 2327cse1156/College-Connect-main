import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auth from "./routes/auth.js"
import cookieParser from "cookie-parser";
import profileRoutes from "./routes/profile.js"
import adminRoutes from "./routes/admin.js"
import roleTranstionRoutes from "./routes/roleTransition.js"
dotenv.config();
const app = express();


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes)
app.use("/api/role-transition", roleTranstionRoutes)

const PORT = process.env.PORT || 5000;

connectDB();
app.use("/api/auth", auth);
app.use("/api/profile",profileRoutes)

app.listen(PORT,()=>{
    console.log(`SERVER RUNNING SUCCESSFULLY on port ${PORT}`);
    
})

