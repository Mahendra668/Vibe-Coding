import React, { useState, useEffect } from 'react';
import { Quote, Loader2, AlertCircle, Sparkles, Copy, Check, Book, User, Calendar, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI } from '../hooks/useAI';
import { PROMPT_TEMPLATES } from '../constants/prompts';
import SaveButton from '../components/SaveButton';

export default function CitationGenerator() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    publisher: ''
  });
  const [copiedStyle, setCopiedStyle] = useState<string | null>(null);
  const { result, isLoading, error, generate, reset } = useAI();

  useEffect(() => {
    reset();
    setFormData({
      title: '',
      author: '',
      year: '',
      publisher: ''
    });
  }, [reset]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || isLoading) return;

    const prompt = PROMPT_TEMPLATES.citation(
      formData.title,
      formData.author,
      formData.year,
      formData.publisher
    );
    await generate(prompt);
  };

  const copyToClipboard = (text: string, style: string) => {
    navigator.clipboard.writeText(text.trim());
    setCopiedStyle(style);
    setTimeout(() => setCopiedStyle(null), 2000);
  };

  const parseCitations = (text: string) => {
    const styles: { [key: string]: string } = {};
    const styleNames = ['APA', 'MLA', 'IEEE', 'Chicago'];
    
    let currentStyle = '';
    const lines = text.split('\n');
    
    lines.forEach(line => {
      const match = styleNames.find(name => line.includes(`### ${name}`));
      if (match) {
        currentStyle = match;
        styles[currentStyle] = '';
      } else if (currentStyle) {
        styles[currentStyle] += line + '\n';
      }
    });

    return styles;
  };

  const citations = result ? parseCitations(result) : null;

  return (
    <div className="space-y-8">
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <Quote className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Citation Generator</h2>
            <p className="text-zinc-500 text-sm">Generate perfectly formatted academic references in multiple styles.</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Book/Article Title</label>
              <div className="relative">
                <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Database System Concepts"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Author(s)</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="e.g. Abraham Silberschatz"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Year of Publication</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g. 2020"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Publisher</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  placeholder="e.g. McGraw Hill"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!formData.title.trim() || isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Citations...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Citations
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
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Formatted References</h3>
              <SaveButton 
                tool="AI Citation Generator"
                prompt={`Citation for: ${formData.title} by ${formData.author}`}
                response={result}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {['APA', 'MLA', 'IEEE', 'Chicago'].map((style) => (
                <div key={style} className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-lg group relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-md">
                      {style} Style
                    </span>
                    <button 
                      onClick={() => copyToClipboard(citations?.[style] || '', style)}
                      className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-indigo-400 transition-all flex items-center gap-2 text-xs"
                    >
                      {copiedStyle === style ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedStyle === style ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-zinc-300 font-serif italic text-lg leading-relaxed">
                    {citations?.[style]?.trim() || 'Not generated'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
