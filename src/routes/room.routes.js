import { Router } from "express";
import { createRoom, getInsti, getMyClasses } from "../controllers/room.controller.js";

const router = Router();

router.post("/room/create", createRoom)
router.post("/room/insti", getInsti)
router.post("/room/classes", getMyClasses)

export default router