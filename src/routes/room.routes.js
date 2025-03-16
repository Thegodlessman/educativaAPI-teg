import { Router } from "express";
import { createRoom } from "../controllers/room.controller.js";

const router = Router();

router.post("/room/create", createRoom)

export default router