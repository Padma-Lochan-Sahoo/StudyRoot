import express from 'express';
import upload from '../middleware/multer.js';
import { uploadNote } from '../controllers/notes.controller.js';
// import { createNote, getAllNotes, getNoteById, updateNote, deleteNote } from '../controllers/note.controller.js';

const router = express.Router();

router.post("/upload", upload.single('file'), uploadNote)

// router.post('/', createNote);
// router.get('/', getAllNotes);
// router.get('/:id', getNoteById);
// router.put('/:id', updateNote);
// router.delete('/:id', deleteNote);

export default router; 