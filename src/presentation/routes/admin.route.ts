import express from "express"
import { AdminController } from "../controllers/admin.controller"
import {isAuthenticated,isAdmin} from "../middleware/isAuthenticated"


const adminRoute = express.Router()

adminRoute.get("/users",isAuthenticated,isAdmin,AdminController.findallUsers)
adminRoute.put("/users/:id",isAuthenticated,isAdmin,AdminController.updateuserDetails)
adminRoute.delete("/users/:id",isAuthenticated,isAdmin,AdminController.deleteuser)
adminRoute.put("/update",isAuthenticated,isAdmin,AdminController.updateadminProfile)
adminRoute.get("/search",isAuthenticated,isAdmin,AdminController.searchuser)


export default adminRoute