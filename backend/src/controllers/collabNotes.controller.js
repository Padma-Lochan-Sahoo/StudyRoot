import CollabNoteSession from "../models/CollabNoteSession.js";
import { sendOtpEmail } from "../lib/utils.js";
import crypto from "crypto";

// Collaborative Note Sessions Controller

// Create a collaborative note session
export const createCollabSession = async (req, res) => {
  try {
    const { title, inviteEmails } = req.body;
    const creator = req.user._id;
    // Generate unique session code
    let sessionCode;
    let exists = true;
    while (exists) {
      sessionCode = crypto.randomBytes(4).toString("hex").toUpperCase();
      exists = await CollabNoteSession.findOne({ sessionCode });
    }
    const session = await CollabNoteSession.create({
      title,
      creator,
      participants: [creator],
      inviteEmails,
      sessionCode,
    });
    // Send invites
    if (Array.isArray(inviteEmails)) {
      for (const email of inviteEmails) {
        // You can customize this email logic
        await sendOtpEmail(email, sessionCode); // Replace with a custom invite email in production
      }
    }
    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error("Create Collab Session Error:", error);
    res.status(500).json({ success: false, message: "Failed to create session" });
  }
};

// Join a collaborative note session by code
export const joinCollabSession = async (req, res) => {
  try {
    const { sessionCode } = req.body;
    const userId = req.user._id;
    const session = await CollabNoteSession.findOne({ sessionCode });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
      await session.save();
    }
    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("Join Collab Session Error:", error);
    res.status(500).json({ success: false, message: "Failed to join session" });
  }
};

// Get all collaborative note sessions for a user
export const getUserCollabSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await CollabNoteSession.find({ participants: userId }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("Get User Collab Sessions Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sessions" });
  }
};

// Delete a collaborative note session
export const deleteCollabSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;
    const session = await CollabNoteSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    if (session.creator.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Only the creator can delete this session" });
    }
    await CollabNoteSession.findByIdAndDelete(sessionId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete Collab Session Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete session" });
  }
}; 