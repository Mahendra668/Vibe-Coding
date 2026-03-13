import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Sparkles, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onNavigate: (view: any) => void;
}

export default function SearchBar({ onSearch, onNavigate }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (q: string) => {
    if (!q.trim()) {
      setSuggestions(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.results);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowDropdown(true);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query);
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions(null);
    setShowDropdown(false);
  };

  const hasResults = suggestions && (
    suggestions.tools.length > 0 || 
    suggestions.history.length > 0 || 
    suggestions.resources.length > 0
  );

  return (
    <div className="relative w-full max-w-xl" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowDropdown(true)}
          placeholder="Search tools, history, or resources..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-12 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
        />
        {query && (
          <button 
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-3 h-3 text-zinc-500" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (query.trim() || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {isLoading && !suggestions && (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">Searching StudentHub...</p>
              </div>
            )}

            {suggestions && (
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {/* Tools Section */}
                {suggestions.tools.length > 0 && (
                  <div className="p-2">
                    <h4 className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tools</h4>
                    {suggestions.tools.map((tool: any) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onNavigate(tool.id);
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{tool.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{tool.category}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                )}

                {/* History Section */}
                {suggestions.history.length > 0 && (
                  <div className="p-2 border-t border-white/5">
                    <h4 className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Saved Content</h4>
                    {suggestions.history.map((item: any) => (
                      <button
                        key={item._id}
                        onClick={() => {
                          onNavigate('history');
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.tool}</p>
                          <p className="text-[10px] text-zinc-500 truncate italic">"{item.prompt}"</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Resources Section */}
                {suggestions.resources.length > 0 && (
                  <div className="p-2 border-t border-white/5">
                    <h4 className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Resources</h4>
                    {suggestions.resources.map((res: any, idx: number) => (
                      <button
                        key={idx}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{res.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{res.type}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                )}

                {!hasResults && !isLoading && (
                  <div className="p-8 text-center opacity-50">
                    <p className="text-sm">No results found for "{query}"</p>
                  </div>
                )}

                {hasResults && (
                  <button 
                    onClick={() => {
                      onSearch(query);
                      setShowDropdown(false);
                    }}
                    className="w-full p-3 text-xs text-indigo-400 hover:bg-indigo-500/10 transition-colors font-medium border-t border-white/5"
                  >
                    View all results for "{query}"
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
