import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
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
        type:[String]
    },
    avatar:{
        type:String,
        default:""
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date
},{timestamps:true});

export default mongoose.model("User",userSchema);