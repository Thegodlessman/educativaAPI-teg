import { Router } from "express";
import { createTest, getTestsByRoom , getStudentTestStatus, setStartTest} from "../controllers/test.controller.js";

const testRouter = Router();

testRouter.post('/test/create', createTest)
testRouter.get('/test/room/:id_room', getTestsByRoom)
testRouter.get('/test/status/:id_room/:id_user', getStudentTestStatus);
testRouter.post('/test/start-student-test', setStartTest)

export default testRouter;