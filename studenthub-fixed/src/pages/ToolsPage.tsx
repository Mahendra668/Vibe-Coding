import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ToolRouter from '../router/ToolRouter';
import { 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Library, 
  Layers, 
  Brain, 
  Code, 
  PenTool, 
  Quote,
  FileSearch
} from 'lucide-react';

export default function ToolsPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();

  const toolNavItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'notes', label: 'Notes Gen', icon: BookOpen },
    { id: 'lecture', label: 'Lecture → Notes', icon: FileText },
    { id: 'study', label: 'Study Pack', icon: Library },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'exam', label: 'Exam Gen', icon: FileSearch },
    { id: 'quiz', label: 'Quiz Gen', icon: Brain },
    { id: 'code', label: 'Code Helper', icon: Code },
    { id: 'homework', label: 'Assignment', icon: PenTool },
    { id: 'citation', label: 'Citation Gen', icon: Quote },
  ];

  return (
    <div className="space-y-8">
      {/* Centralized Tool Navigation */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-2 shadow-xl overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {toolNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/tools/${item.id}`)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all text-sm font-medium ${
                toolId === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-4 h-4 ${toolId === item.id ? 'text-white' : 'text-zinc-500'}`} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Router */}
      <div className="min-h-[600px]">
        <ToolRouter toolId={toolId || ''} />
      </div>
    </div>
  );
}
