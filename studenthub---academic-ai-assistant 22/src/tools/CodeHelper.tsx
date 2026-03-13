import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Code, Terminal, Bug, Zap, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI } from '../hooks/useAI';
import ToolLayout from './ToolLayout';
import SaveButton from '../components/SaveButton';

interface CodeHelperProps {
  template: (language: string, code: string) => string;
}

export default function CodeHelper({ template }: CodeHelperProps) {
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { result, isLoading, error, generate, reset } = useAI();

  useEffect(() => {
    reset();
    setCode('');
    setLanguage('JavaScript');
  }, [reset]);

  const languages = ['C', 'C++', 'Java', 'Python', 'JavaScript'];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;
    await generate('', () => template(language, code));
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseSections = (text: string) => {
    const sections = [
      { id: 'explanation', title: 'Code Explanation', icon: Terminal, color: 'text-blue-400' },
      { id: 'logic', title: 'Logic Breakdown', icon: Zap, color: 'text-purple-400' },
      { id: 'issues', title: 'Possible Issues', icon: Bug, color: 'text-red-400' },
      { id: 'optimization', title: 'Optimization Suggestions', icon: Sparkles, color: 'text-amber-400' },
      { id: 'improved', title: 'Improved Version', icon: FileCode, color: 'text-emerald-400' },
    ];

    return sections.map(section => {
      const regex = new RegExp(`${section.title}(.*?)(?=${sections.map(s => s.title).join('|')}|$)`, 'si');
      const match = text.match(regex);
      return {
        ...section,
        content: match ? match[1].trim().replace(/^[:\n]+/, '') : null
      };
    }).filter(s => s.content);
  };

  const parsedSections = result ? parseSections(result) : [];

  const inputSection = (
    <form onSubmit={handleAnalyze} className="space-y-6">
      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Programming Language</label>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                language === lang 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Paste Your Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste your ${language} code here...`}
          rows={10}
          className="w-full bg-[#0A0A0B] border border-white/10 rounded-2xl p-6 text-sm font-mono focus:outline-none focus:border-amber-500/50 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!code.trim() || isLoading}
        className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/20"
      >
        <Sparkles className="w-5 h-5" />
        {isLoading ? 'Analyzing Code...' : 'Analyze Code'}
      </button>
    </form>
  );

  return (
    <ToolLayout
      title="AI Code Helper"
      description="Understand, debug, and optimize your code instantly."
      icon={Code}
      iconColor="text-amber-400"
      accentColor="bg-amber-500"
      isLoading={isLoading}
      error={error}
      showResults={!!result}
      inputSection={inputSection}
      loadingMessage="AI is reading your code..."
    >
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Analysis Results</h3>
              <div className="flex items-center gap-4">
                <SaveButton 
                  tool="AI Code Helper"
                  prompt={`Language: ${language}\nCode: ${code.substring(0, 200)}...`}
                  response={result}
                />
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Analysis'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {parsedSections.length > 0 ? (
                parsedSections.map((section, idx) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <section.icon className={`w-5 h-5 ${section.color}`} />
                      <h4 className="font-bold text-lg">{section.title}</h4>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      {section.id === 'improved' ? (
                        <pre className="bg-[#0A0A0B] p-6 rounded-2xl border border-white/5 overflow-x-auto">
                          <code className="text-sm font-mono text-zinc-300">
                            {section.content}
                          </code>
                        </pre>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-400">
                          {section.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-xl">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-300">
                      {result}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}
