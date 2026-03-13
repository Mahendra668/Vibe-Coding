import React from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import SaveButton from '../SaveButton';

interface AIResultDisplayProps {
  result: string;
  isLoading?: boolean;
  error?: string | null;
  tool: string;
  prompt: string;
  provider?: string;
  cached?: boolean;
}

export default function AIResultDisplay({ 
  result, 
  isLoading, 
  error, 
  tool, 
  prompt,
  provider,
  cached 
}: AIResultDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-4 opacity-50">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse">AI is thinking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">AI Response</span>
          {provider && (
            <span className="text-[10px] text-zinc-600 font-bold uppercase ml-2">
              via {provider} {cached && '• Cached'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SaveButton 
            tool={tool}
            prompt={prompt}
            response={result}
          />
          <button 
            onClick={copyToClipboard}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 transition-colors flex items-center gap-2 text-xs border border-white/10"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="p-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
            {result}
          </p>
        </div>
      </div>
    </div>
  );
}
