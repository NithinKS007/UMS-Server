import express from "express"
import { UserController } from "../controllers/user.controller"
import { signupValidation,signinValidation } from "../validation/user.validation"
import { validateRequest } from "../middleware/validation.middleware"

const userRoute = express.Router()

userRoute.post("/signup",signupValidation,validateRequest,UserController.signup)
userRoute.post("/signin",signinValidation,validateRequest,UserController.signin)

export default userRoute