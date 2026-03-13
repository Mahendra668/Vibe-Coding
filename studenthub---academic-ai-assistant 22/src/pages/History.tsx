import React, { useState, useEffect } from 'react';
import { Clock, Search, ChevronRight, BookOpen, Brain, Code, PenTool, Library, Layers, FileText, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface HistoryItem {
  _id: string;
  tool: string;
  prompt: string;
  response: string;
  createdAt: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setHistory(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data.message || 'Failed to retrieve history');
        }
      } catch (err) {
        setError('Failed to fetch history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const getToolIcon = (name: any) => {
    if (!name || typeof name !== 'string') return MessageSquare;
    switch (name.toLowerCase()) {
      case 'notes generator': return BookOpen;
      case 'quiz generator': return Brain;
      case 'code helper': return Code;
      case 'assignment writer': return PenTool;
      case 'study package': return Library;
      case 'flashcards': return Layers;
      case 'exam generator': return FileText;
      default: return MessageSquare;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4 opacity-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p>Loading your academic history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Academic History</h2>
          <p className="text-zinc-500 text-sm">Your previously generated study materials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* History List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {history.length === 0 ? (
            <div className="bg-[#121214] border border-white/5 rounded-2xl p-8 text-center opacity-50">
              <Clock className="w-10 h-10 mx-auto mb-3 text-zinc-600" />
              <p className="text-sm">No history found yet.</p>
            </div>
          ) : (
            history.map((item) => {
              const Icon = getToolIcon(item.tool);
              return (
                <motion.div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedItem?._id === item._id 
                      ? 'bg-indigo-600/10 border-indigo-500/50' 
                      : 'bg-[#121214] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">{item.tool}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-xl h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                      {React.createElement(getToolIcon(selectedItem.tool), { className: "w-6 h-6 text-indigo-400" })}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedItem.tool}</h3>
                      <p className="text-xs text-zinc-500">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Input Prompt</h4>
                    <div className="bg-white/5 rounded-2xl p-4 text-sm text-zinc-400 italic">
                      "{selectedItem.prompt}"
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">AI Response</h4>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-300">
                        {selectedItem.response}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#121214] border border-white/5 border-dashed rounded-3xl p-12 h-full flex flex-col items-center justify-center text-center opacity-30">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Select an item to view</h3>
                <p className="text-sm max-w-xs">Choose a previously generated result from the list to see the full content and prompt.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
