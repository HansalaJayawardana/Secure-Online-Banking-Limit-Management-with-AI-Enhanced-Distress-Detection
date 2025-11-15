import admin from "firebase-admin";
const db = admin.firestore();

// Create new limit increase request
export const createLimitRequest = async (req, res) => {
  const { userId, amount, reason, type } = req.body;
  try {
    const docRef = await db.collection("limitRequests").add({
      userId,
      amount,
      reason,
      type,
      status: "Pending",
      createdAt: new Date()
    });
    res.json({ success: true, id: docRef.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get requests for a specific user
export const getUserRequests = async (req, res) => {
  try {
    const snapshot = await db.collection("limitRequests")
      .where("userId", "==", req.params.userId)
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, requests: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
