import { Router } from "express";
import { createTest } from "../controllers/test.controller.js";

const testRouter = Router();

testRouter.post('/test/create', createTest)
testRouter.get('/test/room/:id_room')

export default testRouter;