import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { saveAIResult, getFullHistory } from '../controllers/userController.ts';

const router = Router();

// POST /api/history/save
router.post('/save', authMiddleware, saveAIResult);

// GET /api/history
router.get('/', authMiddleware, getFullHistory);

export default router;
