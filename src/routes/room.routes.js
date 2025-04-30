import { Router } from "express";
import { createRoom, getInsti, getMyClasses, joinRoom } from "../controllers/room.controller.js";

const router = Router();

router.post("/room/create", createRoom)
router.post("/room/insti", getInsti)
router.post("/room/classes", getMyClasses)
router.post("/room/join", joinRoom)

export default router