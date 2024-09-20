import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function  deleteFile(avatarpublicid) {
       try {
         if(!avatarpublicid) return null
         const res = cloudinary.uploader.destroy(avatarpublicid)
         return true
       } catch (error) {
         console.log(error)
         return null
       }
}

export default {deleteFile}
