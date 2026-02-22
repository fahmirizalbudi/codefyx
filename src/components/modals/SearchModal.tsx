"use client";

import React, { useState, useEffect } from 'react';
import { X, MagnifyingGlass, ChatCircle, ArrowRight } from '@phosphor-icons/react';
import { supabase } from '@/src/lib/supabaseClient';
import { cn } from '@/src/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMessage: (sessionId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectMessage }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  const handleSearch = async (term: string) => {
    setQuery(term);
    if (term.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .ilike('content', `%${term}%`)
        .limit(8);

      if (data) setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0a0a0a] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#27272a]">
          <MagnifyingGlass weight="bold" className="w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            autoFocus
            placeholder="Search messages..." 
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-[15px] font-medium"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-[#27272a] rounded-lg text-gray-500 hover:text-white transition-colors"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-[13px]">Searching...</div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1">
              {results.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    onSelectMessage(msg.session_id || 'default');
                    onClose();
                  }}
                  className="w-full text-left px-4 py-3.5 rounded-xl hover:bg-[#1a1a1a] group transition-all border border-transparent hover:border-[#27272a]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                        msg.role === 'user' ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                      )}>
                        {msg.role}
                      </span>
                      <span className="text-[11px] text-gray-600 font-medium">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300" />
                  </div>
                  <p className="text-[14px] text-gray-300 line-clamp-2 leading-relaxed pl-1">
                    {msg.content}
                  </p>
                </button>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="p-12 text-center">
              <p className="text-gray-300 font-medium mb-1">No results found</p>
              <p className="text-gray-600 text-[13px]">Try different keywords to find your chat.</p>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1a1a1a] mb-4 text-gray-600">
                <ChatCircle weight="duotone" className="w-6 h-6" />
              </div>
              <p className="text-gray-500 text-[13px]">Search for code snippets, ideas, or past conversations.</p>
            </div>
          )}
        </div>
        
        <div className="px-5 py-3 bg-[#0a0a0a] border-t border-[#27272a] flex justify-between items-center text-[11px] text-gray-600">
          <span>{results.length} results</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1"><kbd className="font-sans bg-[#1a1a1a] px-1 rounded border border-[#333]">↑</kbd> <kbd className="font-sans bg-[#1a1a1a] px-1 rounded border border-[#333]">↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="font-sans bg-[#1a1a1a] px-1 rounded border border-[#333]">esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
