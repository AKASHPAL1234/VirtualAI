import { response } from "express";
import { uploadOnCloudnery } from "../config/cloundanry.js";
import { gentoken } from "../config/token.js";
import { geminiresponse } from "../geminiapi.js";
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import moment from "moment/moment.js";

export const  signup=async(req,res)=>{
    try {
        const {name,email,password}=req.body;

    const existingemail= await User.findOne({email})
    if(existingemail){
        return res.status(400).json({message:"user alrady register"})
    }
     if(password.length<6){
        return res.status(400).json({message:"password atleast 6 character"});
    }
    const hashpassword=await bcrypt.hash(password,10);
    const user=await User.create(
       { name,password:hashpassword,email}
    )

    const token=await gentoken(user._id);
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        secure:false
    })
     return res.status(201).json({message:"User SingUp sucessfully"})
    } catch (error) {
        return res.status(400).json({message:` error in SignUp ${error}`})        
    }
}

export const  singin=async(req,res)=>{
    try {
        const {email,password}=req.body;

    const user= await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"user not register"})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:"Enter a valid password"})

    }

    const token= await gentoken(user._id);
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        secure:false
    })
     return res.status(201).json({message:"User SingIn sucessfully"})
    } catch (error) {
        return res.status(400).json({message:` error in SignIn ${error}`})        
    }
}


export  const logout=(req,res)=>{
    try {
        res.clearCookie("token")
          return res.status(200).json({message:"User logout sucessfully"})

        
    } catch (error) {
         return res.status(400).json({message:` error in logout ${error}`}) 
        
    }
}


export const updateassistent= async(req,res)=>{
    try {
        const {assistentname,imageUrl}=req.body;
        let assistentimage;
        if(req.file){
            assistentimage=await uploadOnCloudnery(req.file.path)
        }else{
            assistentimage=imageUrl;
        }
        const user=await User.findByIdAndUpdate(req.userId,{
            assistentname,assistentimage
        },{new:true}).select("-password")
        return res.status(200).json(user)
        
    } catch (error) {
         return res.status(400).json({message:` error in updateassistent ${error}`}) 
        
    }
    
}


export const asktoassistent=async(req,res)=>{
    try {
        const {command}=req.body;
        const user=await User.findById(req.userId)
        user.history.push(command)
        user.save()
        const username=user.name             
        const assistantName=user.assistentname  
        const result=await geminiresponse(command,assistantName,username);
        const jsonMatch=result.match(/{[\s\S]*}/) 
    
        if(!jsonMatch){
            return res.status(400).json({response:"sorry i can't understand"})
        } 

        const gemresult=JSON.parse(jsonMatch[0])
        const type=gemresult.type

        switch(type){
            case 'get_date':
                return res.json({
                    type,
                    userInput:gemresult.userinput,
                    response:`current date is ${moment().format("YYYY-MM-DD")}`
                });
                case 'get_time':
                    return res.json({
                    type,
                    userInput:gemresult.userinput,
                    response:`current time is ${moment().format("hh:mmA")}`
                });
                 case 'get_day':
                    return res.json({
                    type,
                    userInput:gemresult.userinput,
                    response:`today is ${moment().format("dddd")}`
                });
                case 'get_month':
                    return res.json({
                    type,
                    userInput:gemresult.userinput,
                    response:`today is ${moment().format("MMMM")}`
                });
                case 'google_search':
                case 'youtube_search':
                case 'youtube_play':
                case 'general':
                case 'calculator_open':
                case 'instagram_open':
                case 'facebook_open':
                case 'weather_show':
                    return res.json({
                        type,
                        userInput:gemresult.userinput,
                        response:gemresult.response
                    })
                    default:
                      return res.status(400).json({response:" i did't understand"})
        }


    } catch (error) {
          return res.status(400).json({message:` error in asktoassistent ${error}`}) 
        
    }
}