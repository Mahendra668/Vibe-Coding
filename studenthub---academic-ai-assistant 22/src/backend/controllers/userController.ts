import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import { User, AIHistory } from '../models/index.ts';

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('name email createdAt');
    const history = await AIHistory.find({ userId: req.user?.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('toolName prompt response createdAt');
    
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
  const { toolName, prompt, response } = req.body;

  try {
    const newHistory = new AIHistory({
      userId: req.user?.id,
      toolName,
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
      .select('toolName prompt response createdAt');
      
    res.json({ 
      success: true, 
      data: history,
      message: "History retrieved successfully"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
