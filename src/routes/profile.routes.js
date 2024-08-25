import { Router } from "express";
import { getRoleId, selectRole } from "../controllers/profile.controller.js";


const profileRouter = Router();

profileRouter.patch('/profile/role/:id', selectRole);

profileRouter.get('/profile/get/role/:rol_name', getRoleId);


export default profileRouter; 