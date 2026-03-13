import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateAIContent } from '../services/aiService';
import SaveButton from '../components/SaveButton';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  provider?: string;
  cached?: boolean;
}

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const data = await generateAIContent(userMessage, abortControllerRef.current.signal);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.response,
        provider: data.provider,
        cached: data.cached
      }]);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to connect to the AI service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-semibold">Academic Chat</h2>
            <p className="text-xs text-zinc-500">General assistance</p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="hidden lg:flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-lg font-medium">Start a conversation</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white/5 border border-white/10'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'ai' && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-4">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">{msg.provider} {msg.cached && '• Cached'}</p>
                  <SaveButton 
                    tool="AI Chat"
                    prompt={messages[idx - 1]?.content || "Chat Message"}
                    response={msg.content}
                    className="!bg-transparent !border-none !p-0 !px-0"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-sm text-zinc-400">Thinking...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
            {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 border-t border-white/5 bg-white/[0.02]">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-[#1A1A1C] border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-indigo-500/50"
          />
          <button type="submit" disabled={!prompt.trim() || isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
