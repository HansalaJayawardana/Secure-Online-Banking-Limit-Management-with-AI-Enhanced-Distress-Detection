import express from "express";
import { createLimitRequest, getUserRequests } from "../controllers/requestcontroller.js";

const router = express.Router();

// Create new request
router.post("/", createLimitRequest);

// Get all requests for a user
router.get("/:userId", getUserRequests);

export default router;
