import express from "express"
import { UserController } from "../controllers/user.controller"
import { signupValidation,signinValidation } from "../validation/user.validation"
import { validateRequest } from "../middleware/validation.middleware"
import { AuthController } from "../controllers/auth.controller"
import isAuthenticated from "../middleware/isAuthenticated"

const userRoute = express.Router()

userRoute.post("/signup",signupValidation,validateRequest,AuthController.signup)
userRoute.post("/signin",signinValidation,validateRequest,AuthController.signin)
userRoute.post("/signout",isAuthenticated,AuthController.signout)

userRoute.post("/refresh",AuthController.generateRefreshToken)

export default userRoute