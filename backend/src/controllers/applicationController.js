import { Application } from "../models/Application.models.js";
import { createApplicationSchema } from "../validator/applicationValidator.js";

export const createApplication= async(req, res)=>{
    try{
        const parsed= createApplicationSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message:"validation failes", error:parsed.error.errors});
        }
        const application= await Application.create({
            userId:req.user._id,
            ...parsed.data
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