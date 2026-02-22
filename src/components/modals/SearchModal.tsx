"use client";

import React, { useState, useEffect } from 'react';
import { X, MagnifyingGlass, ChatCircle } from '@phosphor-icons/react';
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
    if (isOpen) {
      // Focus input logic could go here
    } else {
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
        .limit(10);

      if (data) setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#333]">
          <MagnifyingGlass className="w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            autoFocus
            placeholder="Search messages..." 
            className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 text-[15px]"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button onClick={onClose} className="p-1 hover:bg-[#333] rounded-lg text-gray-500 hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Searching...</div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1">
              {results.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    onSelectMessage(msg.session_id || 'default');
                    onClose();
                  }}
                  className="text-left px-4 py-3 rounded-xl hover:bg-[#262626] group transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ChatCircle className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase">{msg.role}</span>
                    <span className="text-xs text-gray-600">• {new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{msg.content}</p>
                </button>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No matches found.</div>
          ) : (
            <div className="p-8 text-center text-gray-600 text-sm">Type to search your chat history.</div>
          )}
        </div>
      </div>
    </div>
  );
};
