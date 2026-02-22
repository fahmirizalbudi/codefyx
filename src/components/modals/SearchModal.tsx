"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, ChatCircle, MagnifyingGlass, X } from "@phosphor-icons/react";
import { supabase } from "@/src/lib/supabaseClient";
import { cn } from "@/src/lib/utils";

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
      <div className="w-full max-w-xl bg-[#0a0a0a] rounded-[28px] shadow-none ring-1 ring-white/5 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3 px-6 py-5">
          <MagnifyingGlass weight="bold" className="w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            autoFocus
            placeholder="Search your conversations..." 
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 text-[16px] font-medium"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-[#1a1a1a] rounded-full text-gray-500 hover:text-white transition-colors"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[450px] overflow-y-auto custom-scrollbar px-3 pb-4">
          {loading ? (
            <div className="p-12 text-center text-gray-500 text-[14px]">
              <div className="flex justify-center mb-2">
                <div className="w-5 h-5 border-2 border-gray-700 border-t-gray-400 rounded-full animate-spin" />
              </div>
              Searching history...
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1">
              {results.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    onSelectMessage(msg.session_id || 'default');
                    onClose();
                  }}
                  className="w-full text-left px-4 py-4 rounded-[20px] hover:bg-[#111] group transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        msg.role === 'user' ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                      )}>
                        {msg.role}
                      </span>
                      <span className="text-[11px] text-gray-600 font-medium">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <ArrowRight weight="bold" className="w-4 h-4 text-gray-700 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <p className="text-[14px] text-gray-400 line-clamp-2 leading-relaxed group-hover:text-gray-200 transition-colors">
                    {msg.content}
                  </p>
                </button>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="p-16 text-center">
              <p className="text-gray-400 font-medium mb-1">No matches found</p>
              <p className="text-gray-600 text-[13px]">Try different keywords or dates.</p>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#111] mb-5 text-gray-600 ring-1 ring-white/5">
                <ChatCircle weight="duotone" className="w-7 h-7" />
              </div>
              <p className="text-gray-500 text-[14px] max-w-[240px] mx-auto leading-relaxed">
                Search for code, ideas, or past conversations across your chats.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
