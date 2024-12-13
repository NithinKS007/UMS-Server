import express from "express"
import { signupValidation,signinValidation } from "../validation/user.validation"
import { validateRequest } from "../middleware/validation.middleware"
import { AuthController } from "../controllers/auth.controller"
import {isAuthenticated,isUser} from "../middleware/isAuthenticated"
import { UserController } from "../controllers/user.controller"

const userRoute = express.Router()

userRoute.post("/signup",signupValidation,validateRequest,AuthController.signup)
userRoute.post("/signin",signinValidation,validateRequest,AuthController.signin)
userRoute.post("/signout",isAuthenticated,isUser,AuthController.signout)
userRoute.post("/refresh",AuthController.generateRefreshToken)

userRoute.put("/update",isAuthenticated,isUser,UserController.updateuserProfile)



export default userRoute