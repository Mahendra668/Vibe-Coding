import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { User, AIHistory } from '../models/index.ts';

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('name email createdAt');
    const history = await AIHistory.find({ userId: req.user?.id })
      .sort({ createdAt: -1 })
      .limit(5)
      // FIX 7: Field is now 'tool', not 'toolName'
      .select('tool prompt response createdAt');

    const savedCount = await AIHistory.countDocuments({ userId: req.user?.id });

    res.json({
      success: true,
      data: {
        user,
        recentActivity: history,
        stats: {
          savedItems: savedCount
        }
      },
      message: "Dashboard data retrieved successfully"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveAIResult = async (req: AuthRequest, res: Response) => {
  // FIX 7: Destructure 'tool' (was 'toolName')
  const { tool, prompt, response } = req.body;

  // FIX 10: Basic input validation
  if (!tool || !prompt || !response) {
    return res.status(400).json({ success: false, message: 'tool, prompt, and response are required' });
  }

  try {
    const newHistory = new AIHistory({
      userId: req.user?.id,
      // FIX 7: Use 'tool' field
      tool,
      prompt,
      response
    });

    await newHistory.save();
    res.json({
      success: true,
      data: newHistory,
      message: 'Result saved successfully'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFullHistory = async (req: AuthRequest, res: Response) => {
  try {
    const history = await AIHistory.find({ userId: req.user?.id })
      .sort({ createdAt: -1 })
      // FIX 7: Field is now 'tool', not 'toolName'
      .select('tool prompt response createdAt');

    res.json({
      success: true,
      data: history,
      message: "History retrieved successfully"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
