import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";

dotenv.config();

const router = express.Router();

// in-memory OTP store
const activeOtps = {};

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);
// Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    activeOtps[email] = {
      otp,
      expires: Date.now() + 2 * 60 * 1000,
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "SafeBank+ Verification Code",
      text: `Your SafeBank+ OTP is ${otp}. It expires in 2 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("OTP sent:", info);
    res.json({ success: true });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, code } = req.body;
  const record = activeOtps[email];

  if (!record) return res.status(400).json({ error: "No OTP found" });
  if (Date.now() > record.expires) return res.status(400).json({ error: "OTP expired" });
  if (record.otp !== code) return res.status(400).json({ error: "Invalid OTP" });

  delete activeOtps[email];
  res.json({ success: true });
});

// THIS is required for ES module import
export default router;
