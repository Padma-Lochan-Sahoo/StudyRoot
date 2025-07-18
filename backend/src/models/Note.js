import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileSize: {
    type: String,
  },
  uploadDate: { 
    type: Date, 
    default: Date.now 
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloads: { 
    type: Number, 
    default: 0 
  },
});

// ✅ Prevent duplicate note titles under the same subject
noteSchema.index({ title: 1, subject: 1 }, { unique: true });
noteSchema.index({ fileUrl: 1, subject: 1 }, { unique: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;