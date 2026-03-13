import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, RotateCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI } from '../hooks/useAI';
import ToolLayout from './ToolLayout';
import SaveButton from '../components/SaveButton';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardGeneratorProps {
  template: (topic: string) => string;
}

export default function FlashcardGenerator({ template }: FlashcardGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { result, isLoading, error, generate, reset } = useAI();

  useEffect(() => {
    reset();
    setTopic('');
    setFlashcards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [reset]);

  const parseFlashcards = (text: string): Flashcard[] => {
    const cards: Flashcard[] = [];
    const regex = /Question:\s*(.*?)\s*Answer:\s*(.*?)(?=Flashcard|\n\n|$)/gs;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      if (match[1] && match[2]) {
        cards.push({
          question: match[1].trim(),
          answer: match[2].trim()
        });
      }
    }

    return cards;
  };

  useEffect(() => {
    if (result) {
      const parsed = parseFlashcards(result);
      if (parsed.length > 0) {
        setFlashcards(parsed);
      }
    }
  }, [result]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    await generate(topic, template);
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const inputSection = (
    <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter Topic (e.g., OS Scheduling)"
        className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!topic.trim() || isLoading}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap"
      >
        <Sparkles className="w-5 h-5" />
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );

  return (
    <ToolLayout
      title="AI Flashcard Generator"
      description="Create 10 revision cards for any topic."
      icon={Layers}
      iconColor="text-emerald-400"
      accentColor="bg-emerald-500"
      isLoading={isLoading}
      error={error}
      showResults={flashcards.length > 0}
      inputSection={inputSection}
      loadingMessage="Generating your flashcards..."
    >
      <AnimatePresence mode="wait">
        {flashcards.length > 0 && (
          <motion.div
            key="flashcard-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              <div className="flex items-center gap-4">
                <SaveButton 
                  tool="Flashcards"
                  prompt={topic}
                  response={flashcards.map((f, i) => `Flashcard ${i+1}\nQuestion: ${f.question}\nAnswer: ${f.answer}`).join('\n\n')}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={prevCard} 
                    disabled={currentIndex === 0}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={nextCard} 
                    disabled={currentIndex === flashcards.length - 1}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div 
              className="perspective-1000 h-80 cursor-pointer group"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="relative w-full h-full transition-all duration-500 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div className="absolute inset-0 backface-hidden bg-[#121214] border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl">
                  <span className="absolute top-6 left-6 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Question</span>
                  <p className="text-xl font-medium leading-relaxed">
                    {flashcards[currentIndex].question}
                  </p>
                  <div className="absolute bottom-6 flex items-center gap-2 text-xs text-zinc-500 font-medium">
                    <RotateCw className="w-3 h-3" /> Click to flip
                  </div>
                </div>

                <div 
                  className="absolute inset-0 backface-hidden bg-emerald-600 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <span className="absolute top-6 left-6 text-[10px] font-bold text-white/60 uppercase tracking-widest">Answer</span>
                  <p className="text-xl font-semibold leading-relaxed text-white">
                    {flashcards[currentIndex].answer}
                  </p>
                  <div className="absolute bottom-6 flex items-center gap-2 text-xs text-white/60 font-medium">
                    <RotateCw className="w-3 h-3" /> Click to flip back
                  </div>
                </div>
              </motion.div>
            </div>

            <p className="text-center text-xs text-zinc-600 italic">
              Tip: Try to answer the question before flipping the card!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </ToolLayout>
  );
}
