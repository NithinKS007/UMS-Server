import express from "express"
import { AdminController } from "../controllers/admin.controller"
import isAuthenticated from "../middleware/isAuthenticated"


const adminRoute = express.Router()

adminRoute.get("/users",isAuthenticated,AdminController.findallUsers)


export default adminRoute