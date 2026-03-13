import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, Clock, BookOpen, ChevronRight, AlertCircle, FileText, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface SearchResultsProps {
  query: string;
  onNavigate: (view: any) => void;
}

export default function SearchResults({ query, onNavigate }: SearchResultsProps) {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setResults(data.results);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch search results');
      } finally {
        setIsLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query, token]);

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4 opacity-50">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        <p className="text-lg font-medium animate-pulse">Searching StudentHub for "{query}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-3xl flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-12 h-12" />
        <div>
          <h3 className="text-xl font-bold mb-1">Search Error</h3>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  const hasResults = results && (
    results.tools.length > 0 || 
    results.history.length > 0 || 
    results.resources.length > 0
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Search Results</h2>
          <p className="text-zinc-500 mt-1">Found results for <span className="text-indigo-400 font-semibold">"{query}"</span></p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
          <LayoutGrid className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Categorized View</span>
        </div>
      </div>

      {!hasResults ? (
        <div className="bg-[#121214] border border-white/5 rounded-3xl p-16 text-center opacity-50">
          <Search className="w-16 h-16 mx-auto mb-6 text-zinc-700" />
          <h3 className="text-2xl font-bold mb-2">No results found</h3>
          <p className="text-zinc-500 max-w-md mx-auto">
            We couldn't find anything matching your search. Try different keywords or check your spelling.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tools Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">AI & File Tools</h3>
              <span className="ml-auto text-[10px] bg-white/5 px-2 py-1 rounded-full text-zinc-500">{results.tools.length}</span>
            </div>
            <div className="space-y-3">
              {results.tools.map((tool: any) => (
                <motion.div
                  key={tool.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate(tool.id)}
                  className="bg-[#121214] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{tool.name}</h4>
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{tool.desc}</p>
                      <span className="inline-block mt-3 text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                        {tool.category}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-indigo-400 transition-all" />
                  </div>
                </motion.div>
              ))}
              {results.tools.length === 0 && (
                <div className="p-8 border border-white/5 border-dashed rounded-2xl text-center opacity-30">
                  <p className="text-xs italic">No tools matched</p>
                </div>
              )}
            </div>
          </div>

          {/* Saved Content Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Saved Content</h3>
              <span className="ml-auto text-[10px] bg-white/5 px-2 py-1 rounded-full text-zinc-500">{results.history.length}</span>
            </div>
            <div className="space-y-3">
              {results.history.map((item: any) => (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate('history')}
                  className="bg-[#121214] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{item.tool}</h4>
                      <p className="text-sm text-zinc-500 mt-1 italic line-clamp-2">"{item.prompt}"</p>
                      <p className="text-[10px] text-zinc-600 mt-3 font-bold uppercase tracking-widest">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-400 transition-all" />
                  </div>
                </motion.div>
              ))}
              {results.history.length === 0 && (
                <div className="p-8 border border-white/5 border-dashed rounded-2xl text-center opacity-30">
                  <p className="text-xs italic">No history matched</p>
                </div>
              )}
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Study Resources</h3>
              <span className="ml-auto text-[10px] bg-white/5 px-2 py-1 rounded-full text-zinc-500">{results.resources.length}</span>
            </div>
            <div className="space-y-3">
              {results.resources.map((res: any, idx: number) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#121214] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] font-bold text-amber-400/50 uppercase tracking-widest">{res.type}</span>
                      </div>
                      <h4 className="font-bold text-lg group-hover:text-amber-400 transition-colors">{res.name}</h4>
                      <p className="text-xs text-zinc-500 mt-2">External academic resource</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-amber-400 transition-all" />
                  </div>
                </motion.div>
              ))}
              {results.resources.length === 0 && (
                <div className="p-8 border border-white/5 border-dashed rounded-2xl text-center opacity-30">
                  <p className="text-xs italic">No resources matched</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
