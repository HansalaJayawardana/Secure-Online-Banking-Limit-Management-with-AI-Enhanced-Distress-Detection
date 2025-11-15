// safebank-backend/index.js
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { createRequire } from 'node:module';
import otpRoutes from "./routes/otp.js";
import emotionRoutes from "./routes/emotion.js";
import dotenv from "dotenv";

dotenv.config();


const require = createRequire(import.meta.url);

const serviceAccount = require('./serviceAccountKey.json');


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/otp", otpRoutes);
app.use("/emotion", emotionRoutes);

// Init Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Example API: Save Limit Request
app.post("/request-limit", async (req, res) => {
  try {
    const { userId, amount, reason, type } = req.body;
    const doc = await db.collection("limitRequests").add({
      userId,
      amount,
      reason,
      type,
      status: "Pending",
      createdAt: new Date()
    });
    res.json({ success: true, id: doc.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example API: Fetch Requests
app.get("/requests/:userId", async (req, res) => {
  try {
    const snapshot = await db.collection("limitRequests")
      .where("userId", "==", req.params.userId).get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
