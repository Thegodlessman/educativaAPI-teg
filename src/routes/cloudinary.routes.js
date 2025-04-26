import express from "express";
import upload from "../config/multer.js";
import { uploadProfilePicture } from "../controllers/userController.js";

const router = express.Router();

router.post("/uploadProfile", upload.single("photo"), uploadProfilePicture);

export default router;