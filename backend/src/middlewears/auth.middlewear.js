import { User } from "../models/user.model.js";
import ApiError from "../utils/Apierror.js";
import asynchandler from "../utils/asynchandler.js";
import jwt, { decode } from "jsonwebtoken"

export const verifyJwt = asynchandler(async(req,res,next)=>{  
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    console.log(token)

    if(!token) throw new ApiError(401, "Unauthorized request")
     
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log(decodedToken)

    if(!decodedToken) throw new ApiError(401, "invalid accessToken" )

    const user =  await User.findById(decodedToken.id).select("-passowrd -refreshToken")
    
    console.log(user)
    req.body = user
    next() 
})