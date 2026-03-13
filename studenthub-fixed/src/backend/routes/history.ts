import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { saveAIResult, getFullHistory } from '../controllers/userController.ts';

const router = Router();

// POST /api/history/save — Save an AI result to history
router.post('/save', authMiddleware, saveAIResult);

// GET /api/history — Get full history for logged-in user
router.get('/', authMiddleware, getFullHistory);

export default router;
