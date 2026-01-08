import { User } from "../models/User.models.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const generateToken= (userId)=>{
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
};
/*
export const registerUser= async(req, res)=>{
    try{
        const {name, email, password}= req.body;
        if(!name || !email || !password){
           return res.status(400).json({message:"All feilds are required"});
        }
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message:"User Allready exist please login"});
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPass=await bcrypt.hash(password,salt);

        const user= await User.create({
            name, 
            email,
            password: hashedPass
        });

        res.status(201).json({
            message: "User registerd successfully",
            token: generateToken(user._id),
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch (err){
       return res.status(500).json({message:`Server error : ${err}`});
    }
};
*/
// temmp below
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log("User created:", user.email);
    console.log("JWT SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser= async(req, res)=>{
    try{
        const {email, password}= req.body;
        if(!email || !password){
          return  res.status(400).json({message: "all feilds are required"});
        }
        const user= await User.findOne({email});
        if(!user){
           return res.status(401).json({message: "Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
           return res.status(401).json({message:"Invalid credentials"});
        }
        res.status(200).json({
            message:"Login Succesful",
            token: generateToken(user._id),
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }catch(err){
       return res.status(500).json({message: `server error : ${err}`});
    }
};
