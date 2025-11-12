import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadOnCloudnery = async (filepath) => {
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  try {
    const uploadResult = await cloudinary.uploader
    .upload(filepath )
    fs.unlinkSync(filepath)
    return uploadResult.secure_url
  } catch (error) {
     fs.unlinkSync(filepath)
     return res.status(500).json({message:"cloudnery error"})
  }
};
