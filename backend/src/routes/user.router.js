import express from "express"
import { loginUser, logoutuser, registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewears/multer.middlewar.js"
import { verifyJwt } from "../middlewears/auth.middlewear.js"

const router = express.Router()

router.route("/register").post(
      upload.fields([
        {
            name :"avatar",
            maxCount: 1,
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post( verifyJwt , logoutuser)

router.route("/refresh-token").post(refreshAccessToken)


export default router

