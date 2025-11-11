import mongoose from "mongoose";
export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongo db connected");
    } catch (error) {
        console.error("Not connected",error.message);
        process.exit(1);
    }
}
