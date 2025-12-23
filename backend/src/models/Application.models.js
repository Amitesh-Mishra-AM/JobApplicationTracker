import mongoose from "mongoose"

const applicationSchema=new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    company:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    dateApplied:{
        type: Date,
        required: true
    },
    notes:{
        type:String,
        maxlength:[1000, "Maximum 1000 chars are only permitted"]
    }
},{timestamps: true});

export const  Application= mongoose.model("Application", applicationSchema);