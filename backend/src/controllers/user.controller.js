// get the data from the front end via req.body
// check if data is availabale in propper format or not
// if data is not available thwo validation Error
// check if user is allready exist or not
// if user exist throw the Error
// cehck is there file in the req.fiels and get their local path
//  if local file path is not available then throw Error
// if path is available upload it on cloudingary and get the url
// check if file is uploded or not
// take the cloudinary url
// and then create the user

import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/Apierror.js";
import { uploadOnCloudinary } from "../utils/FileUpload.js";
import ApiResponce from "../utils/Apiresponce.js";

async function genrateTokens(userId){
 try {
   const user = await User.findById(userId)
   const accessToken = await user.genrateAccessToken()
   const refreshToken = await user.genrateRefreshToken()
   user.refreshToken = refreshToken
   await user.save({validateBeforeSave : false})
   return {accessToken, refreshToken};
 } catch (error) {
   throw new ApiError(500, error?.message  || "Something went wrong while genrating tokens")
 }
}

const registerUser = asynchandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!email || !password || !fullname) {
    throw new ApiError(400, "all feild are required");
  }

  const isUserExist = await User.findOne({ email: email });

  if (isUserExist) {
    throw new ApiError(401, "user is already exist ");
  }

  let avatarLocalFilePath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalFilePath = req.files?.avatar[0]?.path;
  }

  if (!avatarLocalFilePath) throw new ApiError(400, "avatar feild is required");

  let responce = await uploadOnCloudinary(avatarLocalFilePath);

  const cloudinaryUrl = responce?.url;

  const user = await User.create({
    fullname: fullname,
    email: email,
    password: password,
    avatar: cloudinaryUrl,
  });

  if (!user)
    throw new ApiError(400, "Something went wrong while createing user");

  const createdUser = await User.findById(user._id).select("-password");

  res.status(200).json(new ApiResponce("user registered", createdUser));
});

const loginUser = asynchandler(async (req, res) => {
  //  get the data from the user = done
  // check if data is valid = done
  // check is user is eixists in our database = done
  // check if password is correct or not = done
  // genrate tokens
  // stora tokens inside the user document
  // store tokens in cookies and give toekns to the user

  const { email, password } = req.body;
  if ((!email || !password)) throw new ApiError(401, "plesese fill all Feiled");

  const user = await User.findOne({ email: email });

  if (!user) throw new ApiError(401, "user dosn't exists with this email");

  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "incorrect password");

  const {accessToken, refreshToken} = await genrateTokens(user._id)
 
  const loggedInUser = await User.findById(user._id).select(
    "-refreshToken -password" 
  )
  const options ={
    httpOnly : true,
    secure : true,
  }

  res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(new ApiResponce("user loggedin", 
    {
      user : loggedInUser,
      accessToken, 
      refreshToken
    }
  ))

});

const logoutuser = asynchandler(async(req,res)=>{
   res.status(200).json({"message"  : "ok"})
})

export { registerUser, loginUser, logoutuser };
