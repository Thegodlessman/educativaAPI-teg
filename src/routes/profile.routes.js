import { Router } from "express";
import { selectRole } from "../controllers/profile.controller.js";


const profileRouter = Router();

profileRouter.patch('/profile/role/:id', selectRole);



export default profileRouter; 