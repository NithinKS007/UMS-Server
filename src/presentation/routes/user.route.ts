import express from "express"
import { UserController } from "../controllers/user.controller"

const userRoute = express.Router()

userRoute.post("/signup",UserController.signup)
userRoute.post("/signin",UserController.signin)

export default userRoute