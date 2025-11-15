import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authcontroller.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

export default router;
