import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService.ts';

export const generateAIResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required"
      });
    }

    const result = await aiService.generateContent(prompt);

    res.json({
      success: true,
      data: result,
      message: "AI content generated successfully"
    });
  } catch (error: any) {
    next(error);
  }
};
