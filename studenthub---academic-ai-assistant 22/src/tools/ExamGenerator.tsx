import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle, Copy, Check, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI } from '../hooks/useAI';
import SaveButton from '../components/SaveButton';

interface ExamGeneratorProps {
  template: (subject: string, difficulty: string, count: number) => string;
}

export default function ExamGenerator({ template }: ExamGeneratorProps) {
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(10);
  const [copied, setCopied] = useState(false);
  const { result, isLoading, error, generate, reset } = useAI();

  useEffect(() => {
    reset();
    setSubject('');
    setDifficulty('Medium');
    setCount(10);
  }, [reset]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || isLoading) return;
    await generate('', () => template(subject, difficulty, count));
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Exam Paper Generator</h2>
            <p className="text-zinc-500 text-sm">Create professional exam papers for any subject.</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Computer Networks, Modern History"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Difficulty Level</label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                      difficulty === level 
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' 
                        : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Target Question Count</label>
              <span className="text-xs font-bold text-amber-400">{count} Questions</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              step="1"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={!subject.trim() || isLoading}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Paper...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Exam Paper
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SaveButton 
                  tool="Exam Generator"
                  prompt={`Subject: ${subject}, Difficulty: ${difficulty}, Count: ${count}`}
                  response={result}
                />
                <button 
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 transition-colors flex items-center gap-2 text-xs border border-white/10"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Paper'}
                </button>
              </div>
            </div>
            <div className="p-10">
              <div className="max-w-none prose prose-invert">
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                  {result}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && !result && (
        <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="text-lg font-medium animate-pulse">Drafting your exam paper...</p>
        </div>
      )}
    </div>
  );
}
