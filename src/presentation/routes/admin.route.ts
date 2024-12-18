import express from "express"
import { AdminController } from "../controllers/admin.controller"
import {isAuthenticated,isAdmin} from "../middleware/isAuthenticated"


const adminRoute = express.Router()

adminRoute.get("/users",isAuthenticated,isAdmin,AdminController.findallUsers)
adminRoute.get("/users/:id",isAuthenticated,isAdmin,AdminController.getUserProfile)
adminRoute.put("/users/:id",isAuthenticated,isAdmin,AdminController.updateuserDetails)
adminRoute.delete("/users/:id",isAuthenticated,isAdmin,AdminController.deleteuser)
adminRoute.patch("/users/:id",isAuthenticated,isAdmin,AdminController.updateUserBlockStatus)
adminRoute.get("/search",isAuthenticated,isAdmin,AdminController.searchuser)
adminRoute.post("/adduser",isAuthenticated,isAdmin,AdminController.adduser)


export default adminRoute