import express from "express";
import {
  getRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/requests", getRequests);
router.post("/approve/:id", approveRequest);
router.post("/reject/:id", rejectRequest);

export default router;
