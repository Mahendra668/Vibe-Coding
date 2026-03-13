import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface ToolCardProps {
  name: string;
  desc: string;
  icon: any;
  color: string;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ name, desc, icon: Icon, color, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-[#121214] border border-white/5 rounded-3xl p-6 text-left hover:border-white/10 transition-all group shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-zinc-100">{name}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </motion.button>
  );
};
