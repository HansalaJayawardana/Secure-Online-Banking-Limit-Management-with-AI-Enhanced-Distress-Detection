import admin from "firebase-admin";
const db = admin.firestore();

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const doc = await db.collection("profiles").doc(req.params.userId).get();
    if (!doc.exists) return res.status(404).json({ success: false, error: "Profile not found" });
    res.json({ success: true, profile: doc.data() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    await db.collection("profiles").doc(req.params.userId).set(req.body, { merge: true });
    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
