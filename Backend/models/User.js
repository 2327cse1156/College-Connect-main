import mongoose from "mongoose";
import { StrictMode } from "react";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["student","senior","alumni"],
        default:"student"
    },
    bio:{
        type:String
    },
    skills:{
        type:String
    },
    token:{
        type:String
    }
},{timestamps:true});

export default mongoose.model("User",userSchema);