import { User } from "../models/user.model.js";
import ApiError from "../utils/Apierror.js";
import asynchandler from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asynchandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) throw new ApiError(401, "invalid accessToken");

    const user = await User.findById(decodedToken.id).select(
      "-password -refreshToken"
    );

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid accestoken");
  }
});
