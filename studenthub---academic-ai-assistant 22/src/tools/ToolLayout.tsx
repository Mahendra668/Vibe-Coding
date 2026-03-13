import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: any;
  iconColor: string;
  accentColor: string;
  isLoading: boolean;
  error: string | null;
  showResults: boolean;
  inputSection: React.ReactNode;
  children: React.ReactNode;
  loadingMessage?: string;
}

export default function ToolLayout({
  title,
  description,
  icon: Icon,
  iconColor,
  accentColor,
  isLoading,
  error,
  showResults,
  inputSection,
  children,
  loadingMessage = "AI is processing your request..."
}: ToolLayoutProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Tool Header & Input */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-12 h-12 rounded-2xl ${iconColor.replace('text-', 'bg-').replace('400', '500')}/10 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-zinc-500 text-sm">{description}</p>
          </div>
        </div>

        {inputSection}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && !showResults && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50"
          >
            <Loader2 className={`w-12 h-12 ${iconColor} animate-spin`} />
            <p className="text-lg font-medium animate-pulse">{loadingMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
