import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const analyzeEmotion = async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ success: false, error: "No image provided" });
  }

  // 1. Save base64 to a temp file
  const tempId = uuidv4();
  const tempPath = path.join("temp", `${tempId}.txt`);

  try {
    // Ensure temp directory exists
    fs.mkdirSync("temp", { recursive: true });

    // Write base64 to a file
    fs.writeFileSync(tempPath, imageBase64);

    // 2. Call Python with the file path
    const py = spawn("python", ["script/emotion.py", tempPath]);

    let result = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", (code) => {
      // Delete temp file after processing
      fs.unlinkSync(tempPath);

      if (code === 0) {
        return res.json({ success: true, emotion: result.trim() });
      } else {
        console.error("Python error:", errorOutput);
        return res.status(500).json({ success: false, error: errorOutput || "Python error" });
      }
    });

  } catch (err) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.error("Server error:", err);
    return res.status(500).json({ success: false, error: "Server failed" });
  }
};
