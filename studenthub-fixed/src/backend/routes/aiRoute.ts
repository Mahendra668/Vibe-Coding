import { Router } from "express";
import { generateAIResponse } from "../controllers/aiController.ts";
import { aiLimiter } from "../middleware/rateLimiter.ts";

const router = Router();

/**
 * POST /api/ai
 * Main endpoint for AI requests.
 */
router.post("/", aiLimiter, generateAIResponse);

export default router;
