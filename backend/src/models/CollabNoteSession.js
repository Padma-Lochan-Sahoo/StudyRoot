import mongoose from "mongoose";

const collabNoteSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  inviteEmails: [{ type: String }],
  sessionCode: { type: String, required: true, unique: true },
  noteContent: { type: String, default: "" },
}, { timestamps: true });

const CollabNoteSession = mongoose.model("CollabNoteSession", collabNoteSessionSchema);
export default CollabNoteSession; 