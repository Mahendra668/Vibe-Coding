import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, BookOpen, List, Lightbulb, HelpCircle, Layers, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI } from '../hooks/useAI';
import ToolLayout from './ToolLayout';
import SaveButton from '../components/SaveButton';

interface StudyModeProps {
  template: (topic: string) => string;
}

interface StudySection {
  title: string;
  content: string;
  icon: any;
}

export default function StudyMode({ template }: StudyModeProps) {
  const [topic, setTopic] = useState('');
  const [sections, setSections] = useState<StudySection[]>([]);
  const [copied, setCopied] = useState(false);
  const { result, isLoading, error, generate, reset } = useAI();

  useEffect(() => {
    reset();
    setTopic('');
    setSections([]);
  }, [reset]);

  const parseResponse = (text: string): StudySection[] => {
    const sectionConfigs = [
      { key: 'Explanation', icon: BookOpen },
      { key: 'Key Points', icon: List },
      { key: 'Short Notes', icon: FileText },
      { key: 'Examples', icon: Lightbulb },
      { key: 'Quiz Questions', icon: HelpCircle },
      { key: 'Flashcards', icon: Layers },
      { key: 'Summary', icon: Sparkles },
    ];

    const parsedSections: StudySection[] = [];
    
    sectionConfigs.forEach((config) => {
      const regex = new RegExp(`### ${config.key}([\\s\\S]*?)(?=###|$)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        parsedSections.push({
          title: config.key,
          content: match[1].trim(),
          icon: config.icon,
        });
      }
    });

    if (parsedSections.length === 0) {
      return [{ title: 'Study Material', content: text, icon: BookOpen }];
    }

    return parsedSections;
  };

  useEffect(() => {
    if (result) {
      setSections(parseResponse(result));
    }
  }, [result]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    await generate(topic, template);
  };

  const copyAll = () => {
    const fullText = sections.map(s => `${s.title}\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputSection = (
    <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter Topic (e.g., Database Normalization)"
        className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-rose-500/50 transition-all"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!topic.trim() || isLoading}
        className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/20 whitespace-nowrap"
      >
        <Sparkles className="w-5 h-5" />
        {isLoading ? 'Generating...' : 'Generate Study Pack'}
      </button>
    </form>
  );

  return (
    <ToolLayout
      title="AI Study Mode"
      description="Generate a comprehensive study kit in seconds."
      icon={Sparkles}
      iconColor="text-rose-400"
      accentColor="bg-rose-500"
      isLoading={isLoading}
      error={error}
      showResults={sections.length > 0}
      inputSection={inputSection}
      loadingMessage="Crafting your study package..."
    >
      <AnimatePresence mode="popLayout">
        {sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end items-center gap-3 mb-4"
          >
            <SaveButton 
              tool="AI Study Mode"
              prompt={topic}
              response={sections.map(s => `${s.title}\n${s.content}`).join('\n\n')}
            />
            <button 
              onClick={copyAll}
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Full Pack' : 'Copy All Sections'}
            </button>
          </motion.div>
        )}

        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-lg mb-6"
          >
            <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-3">
              <section.icon className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">{section.title}</h3>
            </div>
            <div className="p-8">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {section.content}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </ToolLayout>
  );
}
