import express from 'express';
import { protectRoute } from '../middleware/auth.moddleware.js';
import { createCollabSession, joinCollabSession, getUserCollabSessions, deleteCollabSession } from '../controllers/collabNotes.controller.js';

const router = express.Router();

// Collaborative Note Session routes
router.post('/create', protectRoute, createCollabSession);
router.post('/join', protectRoute, joinCollabSession);
router.get('/mine', protectRoute, getUserCollabSessions);
router.delete('/:id', protectRoute, deleteCollabSession);

export default router; 