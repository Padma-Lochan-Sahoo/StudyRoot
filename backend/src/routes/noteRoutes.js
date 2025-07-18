
import express from 'express';
import upload from '../middleware/multer.js';
import { uploadNote, downloadNote, viewNote } from '../controllers/notes.controller.js';
import { isAdmin, protectRoute } from '../middleware/auth.moddleware.js';
// import { createNote, getAllNotes, getNoteById, updateNote, deleteNote } from '../controllers/note.controller.js';

const router = express.Router();

router.post("/upload", protectRoute, isAdmin, upload.single('file'), uploadNote)
router.get('/download/:id', downloadNote);
router.get("/view/:id", viewNote);


// router.post('/', createNote);
// router.get('/', getAllNotes);
// router.get('/:id', getNoteById);
// router.put('/:id', updateNote);
// router.delete('/:id', deleteNote);

export default router; 