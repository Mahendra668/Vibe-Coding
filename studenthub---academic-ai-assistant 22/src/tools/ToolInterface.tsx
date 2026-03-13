import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import AIResultDisplay from '../components/common/AIResultDisplay';
import ToolLayout from './ToolLayout';

interface ToolInterfaceProps {
  title: string;
  description: string;
  placeholder: string;
  icon: any;
  template: (input: string) => string;
  isTextArea?: boolean;
}

export default function ToolInterface({ 
  title, 
  description, 
  placeholder, 
  icon: Icon, 
  template, 
  isTextArea = false 
}: ToolInterfaceProps) {
  const [input, setInput] = useState('');
  const { result, isLoading, error, provider, cached, generate, reset } = useAI();

  // Reset state when tool changes
  useEffect(() => {
    reset();
    setInput('');
  }, [title, reset]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await generate(input, template);
  };

  const inputSection = (
    <form onSubmit={handleGenerate} className="space-y-4">
      <div>
        {isTextArea ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            rows={6}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
          />
        ) : (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        )}
      </div>
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
      >
        <Sparkles className="w-5 h-5" />
        {isLoading ? 'Generating...' : 'Generate with AI'}
      </button>
    </form>
  );

  return (
    <ToolLayout
      title={title}
      description={description}
      icon={Icon}
      iconColor="text-indigo-400"
      accentColor="bg-indigo-500"
      isLoading={isLoading}
      error={error}
      showResults={!!result}
      inputSection={inputSection}
    >
      {result && (
        <AIResultDisplay 
          result={result}
          tool={title}
          prompt={input}
          provider={provider}
          cached={cached}
        />
      )}
    </ToolLayout>
  );
}
