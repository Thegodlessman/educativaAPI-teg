import { Router } from "express";
import { createRoom, getInsti } from "../controllers/room.controller.js";

const router = Router();

router.post("/room/create", createRoom)
router.post("/room/insti", getInsti)

export default router