// models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  course: { type: String, required: true },
  semester: { type: String, required: true },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  downloads: { type: Number, default: 0 },
});

export default mongoose.model("Note", noteSchema);
