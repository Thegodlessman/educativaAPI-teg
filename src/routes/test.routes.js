import { Router } from "express";
import { createTest, getTestsByRoom } from "../controllers/test.controller.js";

const testRouter = Router();

testRouter.post('/test/create', createTest)
testRouter.get('/test/room/:id_room', getTestsByRoom)

export default testRouter;