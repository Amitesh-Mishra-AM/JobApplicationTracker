import { Application } from "../models/Application.models.js";
import { User } from "../models/User.models.js";

export const createApplication= async(req, res)=>{
    try{
        const {company, role, status, dateApplied , notes}=req.body;
        if(!company || !role || !status || !dateApplied || !notes){
            return res.status(400).json({message:"All feilds are required"});
        }
        const application= await Application.create({
            userId:req.user._id,
            company, role, status, dateApplied, notes 
        });
        res.status(201).json(application);
    }catch(err){
        res.status(500).json({message:`server error : ${err} !`});
    }
}

export const getApplications = async(req, res)=>{
    try{
         const {status , search}= req.query;
         const query={userId:req.user._id};
         if(status){
            query.status = status; // exact match
            // query.status={$regex:status, $options:'i'}; 
            // using exact match as it is faster then regex 
         }
         if(search){
            query.$or=[
                    {company: {$regex:search , $options:'i'}},
                    {role: {$regex:search, $options:'i'}}
                    ];
        }
        const application=await Application.find(query).sort({createdAt:-1});
        res.status(200).json(application);
    }catch(err){
        res.status(500).json({message: `server error : ${err}`});
    }
}

export const updateApplication = async(req, res)=>{
    try{
        const application= await Application.findOne({
            _id:req.params.id,
            userId:req.user._id
        });
        if(!application){
            return res.status(404).json({message:`No application found`});
        }
        Object.assign(application, req.body);
        await application.save();
        res.status(200).json(application);
    }catch(err){
        res.status(500).json({message:`server error : ${err}`});
    }
}

export const deleteApplication = async(req, res)=>{
    try{
        const application= await Application.findOneAndDelete({
            _id: req.params.id,
            userId:req.user._id
        });
        if(!application){
            return res.status(404).json({message:`Application not found`});
        }
        res.status(201).json({message:`Application deleted`});
    }catch(err){
        res.status(500).json({message:`server error : ${err}`});
    }
}