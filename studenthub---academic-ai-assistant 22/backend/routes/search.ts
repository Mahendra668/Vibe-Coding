import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';
import { AIHistory } from '../models/index.ts';

const router = Router();

// Static tools data for searching
const TOOLS = [
  { id: 'chat', name: 'AI Chat', category: 'AI Tools', desc: 'Chat with Gemini AI' },
  { id: 'notes', name: 'Notes Generator', category: 'AI Tools', desc: 'Transform any topic into structured study notes' },
  { id: 'lecture', name: 'Lecture → Notes Generator', category: 'AI Tools', desc: 'Convert lecture transcripts into study kits' },
  { id: 'study', name: 'Study Package', category: 'AI Tools', desc: 'Generate a full study kit in one click' },
  { id: 'quiz', name: 'Quiz Generator', category: 'AI Tools', desc: 'Generate practice questions to test your knowledge' },
  { id: 'flashcards', name: 'Flashcards', category: 'AI Tools', desc: 'Active recall revision cards' },
  { id: 'exam', name: 'Exam Generator', category: 'AI Tools', desc: 'Create full exam papers' },
  { id: 'code', name: 'Code Helper', category: 'AI Tools', desc: 'Understand & optimize code' },
  { id: 'homework', name: 'Assignment Writer', category: 'AI Tools', desc: 'Get structured academic answers' },
  { id: 'citation', name: 'Citation Generator', category: 'AI Tools', desc: 'Generate academic references in APA, MLA, IEEE, Chicago' },
  { id: 'pdf-tools', name: 'PDF Tools', category: 'File Tools', desc: 'Merge, split, or convert PDFs' },
  { id: 'image-tools', name: 'Image Tools', category: 'File Tools', desc: 'Compress or convert images' },
];

// Static study resources
const RESOURCES = [
  { name: 'DBMS Fundamentals', type: 'Course', link: '#' },
  { name: 'Operating Systems Guide', type: 'PDF', link: '#' },
  { name: 'Data Structures & Algorithms', type: 'Video', link: '#' },
  { name: 'Computer Networks Cheat Sheet', type: 'Image', link: '#' },
  { name: 'Software Engineering Principles', type: 'Article', link: '#' },
];

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const query = (req.query.q as string || '').toLowerCase();
  
  if (!query) {
    return res.json({ tools: [], history: [], resources: [] });
  }

  try {
    // 1. Search Tools
    const matchedTools = TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.desc.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );

    // 2. Search History (MongoDB)
    const matchedHistory = await AIHistory.find({
      userId: req.user?.id,
      $or: [
        { tool: { $regex: query, $options: 'i' } },
        { prompt: { $regex: query, $options: 'i' } },
        { response: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    // 3. Search Resources
    const matchedResources = RESOURCES.filter(res => 
      res.name.toLowerCase().includes(query) || 
      res.type.toLowerCase().includes(query)
    );

    res.json({
      success: true,
      results: {
        tools: matchedTools,
        history: matchedHistory,
        resources: matchedResources
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
