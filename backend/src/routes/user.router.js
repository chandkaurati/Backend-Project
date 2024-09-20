import express from "express";
import {
  changeCurrentPassword,
  getCurrentSession,
  loginUser,
  logoutuser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewears/multer.middlewar.js";
import { verifyJwt } from "../middlewears/auth.middlewear.js";

const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJwt, logoutuser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/get-session").post(verifyJwt, getCurrentSession);

router.route("/change-password").post(verifyJwt, changeCurrentPassword);

router.route("/update-details").post(verifyJwt, updateUserDetails);

router.route("/update-avatar").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  updateUserAvatar
);

export default router;
