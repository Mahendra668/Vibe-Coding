import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Sparkles, Copy, Check, BookOpen, List, FileText, Layers, Brain, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI } from '../hooks/useAI';
import SaveButton from '../components/SaveButton';

export default function LectureNotesGenerator() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { result, isLoading, error, generate, reset } = useAI();

  useEffect(() => {
    reset();
    setInput('');
  }, [reset]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (input.length > 5000) {
      return;
    }

    const prompt = `You are an AI academic tutor helping students convert lectures into study materials.

Lecture Content:
${input}

Generate structured study material using these sections:

### Summary
Provide a short summary of the lecture.

### Key Points
List the main ideas in bullet points.

### Detailed Notes
Convert the lecture into organized study notes.

### Flashcards
Generate 5 flashcards in the format:
Question → Answer

### Quiz Questions
Generate 5 multiple choice questions with answers.

### Revision Notes
Provide short revision notes for quick study.

Make explanations clear and easy for students.`;

    await generate(prompt);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseSections = (text: string) => {
    const sections: { [key: string]: string } = {};
    const sectionNames = ['Summary', 'Key Points', 'Detailed Notes', 'Flashcards', 'Quiz Questions', 'Revision Notes'];
    
    let currentSection = '';
    const lines = text.split('\n');
    
    lines.forEach(line => {
      const match = sectionNames.find(name => line.includes(`### ${name}`));
      if (match) {
        currentSection = match;
        sections[currentSection] = '';
      } else if (currentSection) {
        sections[currentSection] += line + '\n';
      }
    });

    return sections;
  };

  const sections = result ? parseSections(result) : null;

  return (
    <div className="space-y-8">
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Lecture → Notes Generator</h2>
            <p className="text-zinc-500 text-sm">Transform lecture transcripts or slide content into structured study material.</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Lecture Content</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste lecture notes, slide content, or transcript here..."
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all resize-none custom-scrollbar"
            />
            <div className="flex justify-between px-1">
              <span className="text-[10px] text-zinc-600">{input.length} / 5000 characters</span>
              {input.length > 4500 && <span className="text-[10px] text-amber-500">Approaching limit</span>}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Lecture...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Study Material
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
            className="space-y-6"
          >
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Generated Study Material</h3>
              <div className="flex items-center gap-3">
                <SaveButton 
                  tool="Lecture → Notes Generator"
                  prompt={input.substring(0, 200)}
                  response={result}
                />
                <button 
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 transition-colors flex items-center gap-2 text-xs border border-white/10"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <SectionCard 
                  title="Summary" 
                  icon={FileText} 
                  content={sections?.['Summary']} 
                  color="indigo"
                />
                <SectionCard 
                  title="Key Points" 
                  icon={List} 
                  content={sections?.['Key Points']} 
                  color="purple"
                />
                <SectionCard 
                  title="Revision Notes" 
                  icon={History} 
                  content={sections?.['Revision Notes']} 
                  color="amber"
                />
              </div>

              <div className="space-y-6">
                <SectionCard 
                  title="Detailed Notes" 
                  icon={BookOpen} 
                  content={sections?.['Detailed Notes']} 
                  color="blue"
                />
                <SectionCard 
                  title="Flashcards" 
                  icon={Layers} 
                  content={sections?.['Flashcards']} 
                  color="emerald"
                />
                <SectionCard 
                  title="Quiz Questions" 
                  icon={Brain} 
                  content={sections?.['Quiz Questions']} 
                  color="rose"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionCard({ title, icon: Icon, content, color }: { title: string, icon: any, content?: string, color: string }) {
  const colorClasses: { [key: string]: string } = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    purple: 'bg-purple-500/10 text-purple-400',
    amber: 'bg-amber-500/10 text-amber-400',
    blue: 'bg-blue-500/10 text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    rose: 'bg-rose-500/10 text-rose-400',
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-lg h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-zinc-200">{title}</h4>
      </div>
      <div className="prose prose-invert max-w-none">
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-400">
          {content?.trim() || 'No content generated for this section.'}
        </p>
      </div>
    </div>
  );
}
