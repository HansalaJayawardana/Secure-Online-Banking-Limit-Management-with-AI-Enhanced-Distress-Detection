import express from "express";
import { analyzeEmotion } from "../controllers/emotioncontroller.js";

const router = express.Router();

// Analyze emotion from image/video frame
router.post("/analyze", analyzeEmotion);

export default router;
