import mongoose from "mongoose";

const teamRequestSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true,
        },
        description:{
            type:String,
            required:true,
        },
        event:{
            type:String,
            required:true,
            trim:true,
        },
        eventType:{
            type:String,
            default:"hackathon",
            enum:["hackathon","project","competition","other"],
        },
        skillsNeeded:{
            type:[String],
            required:true,
            default:[],
        },
        spotsAvailable:{
            type:Number,
            required:true,
            min:1,
            default:1,
        },
        status:{
          type:String,
          enum:["open","closed","completed"],
          default:"open",
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        teamMembers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
        applications:[
            {
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User",
                    required:true,
                },
                message:{
                    type:String,
                    default:"",
                },
                status:{
                    type:String,
                    enum:["pending","accepted","rejected"],
                    default:"pending",
                },
                appliedAt:{
                    type:Date,
                    default:Date.now,
                }
            }
        ],
        hackathonId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Hackathon",
            default:null,
        },
        deadline:{
            type:Date,
            default:null,
        },
        tags:{
            type:[String],
            default:[]
        },
    },
    {timestamps:true}
);

teamRequestSchema.index({ status: 1 });
teamRequestSchema.index({ createdBy: 1 });
teamRequestSchema.index({ event: 1 });
teamRequestSchema.index({ createdAt: -1 });

export default mongoose.model("TeamRequest", teamRequestSchema);