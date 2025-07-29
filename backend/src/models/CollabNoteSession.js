import mongoose from "mongoose";

const collabNoteSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  sessionCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  noteContent: {
    type: String,
    default: "",
  },
  documentState: {
    type: Buffer,
  },
  version: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying
collabNoteSessionSchema.index({ sessionCode: 1 });

// Update the updatedAt field before saving
collabNoteSessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const CollabNoteSession = mongoose.model("CollabNoteSession", collabNoteSessionSchema);

export default CollabNoteSession;
