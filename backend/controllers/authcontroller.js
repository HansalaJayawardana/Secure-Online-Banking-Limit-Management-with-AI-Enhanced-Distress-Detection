import admin from "firebase-admin";

// Register new user
export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login (in Firebase, login is usually client-side; here we mint custom token)
export const loginUser = async (req, res) => {
  const { uid } = req.body;
  try {
    const token = await admin.auth().createCustomToken(uid);
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Logout (handled client-side, but you could revoke tokens)
export const logoutUser = async (req, res) => {
  const { uid } = req.body;
  try {
    await admin.auth().revokeRefreshTokens(uid);
    res.json({ success: true, message: "User logged out" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
