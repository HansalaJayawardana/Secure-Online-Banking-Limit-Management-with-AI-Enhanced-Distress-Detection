import express from "express";
import { getProfile, updateProfile } from "../controllers/profilecontroller.js";

const router = express.Router();

// Get profile
router.get("/:userId", getProfile);

// Update profile
router.put("/:userId", updateProfile);

export default router;
