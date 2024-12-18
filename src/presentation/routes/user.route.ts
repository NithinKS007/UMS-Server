import express from "express"
import { signupValidation,signinValidation } from "../validation/user.validation"
import { validateRequest } from "../middleware/validation.middleware"
import { AuthController } from "../controllers/auth.controller"
import {isAuthenticated,isUser} from "../middleware/isAuthenticated"
import { UserController } from "../controllers/user.controller"

const userRoute = express.Router()

//routes common to admin and user 
userRoute.post("/signup",signupValidation,validateRequest,AuthController.signup)
userRoute.post("/signin",signinValidation,validateRequest,AuthController.signin)
userRoute.post("/signout",isAuthenticated,AuthController.signout)
userRoute.post("/refresh",AuthController.refreshAccessToken)
userRoute.put("/update",isAuthenticated,UserController.updateuserProfile)

export default userRoute