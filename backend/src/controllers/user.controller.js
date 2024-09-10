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
import jwt from "jsonwebtoken";
async function genrateTokens(userId) {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.genrateAccessToken();
    const refreshToken = await user.genrateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while genrating tokens"
    );
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
  if (!email || !password) throw new ApiError(401, "plesese fill all Feiled");

  const user = await User.findOne({ email: email });

  if (!user) throw new ApiError(401, "user dosn't exists with this email");

  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "incorrect password");

  const { accessToken, refreshToken } = await genrateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce("user loggedin", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutuser = asynchandler(async (req, res) => {
  // delete the cookies from user's browser
  // delete the refresh toekn from the user document
  await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: {
        refreshToken: undefined,
      },
    },

    {
      new: true,
    }
  );

  // deleting cookis

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce("user logged out successfully ", {}, 200));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "UnAuthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh Token ");
    }

    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Toke is expired or used ");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { newrefreshToken, newaccessToken } = await genrateTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", newaccessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        200,
        { accessToken: newaccessToken, refreshToken: newrefreshToken },
        "Accss token refreshed "
      );
  } catch (error) {
    throw new ApiError(401, error?.message, "invaild refresh token")
  }
});

export { registerUser, loginUser, logoutuser, refreshAccessToken};
