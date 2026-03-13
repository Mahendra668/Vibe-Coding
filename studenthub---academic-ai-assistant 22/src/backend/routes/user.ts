import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { getDashboardData, saveAIResult, getFullHistory } from '../controllers/userController.ts';

const router = Router();

// Get Dashboard Data
router.get('/dashboard', authMiddleware, getDashboardData);

// Save AI Result
router.post('/save', authMiddleware, saveAIResult);

// Get Full History
router.get('/history', authMiddleware, getFullHistory);

export default router;
