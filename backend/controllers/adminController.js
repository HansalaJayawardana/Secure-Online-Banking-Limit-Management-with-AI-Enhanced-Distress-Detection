import Request from "../models/Request.js"; // Mongoose model for limit increase requests
// Get all pending requests
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// Approve request
export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await Request.findByIdAndUpdate(id, { status: "approved" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// Reject request
export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await Request.findByIdAndUpdate(id, { status: "rejected" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
