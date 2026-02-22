"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Microphone, ArrowUp } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend(input);
        setInput('');
      }
    }
  };

  return (
    <div className="w-full relative group">
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative w-full bg-[#1a1a1a] rounded-[24px] p-2 flex items-end gap-2 transition-all duration-300 border border-[#27272a]",
          isFocused 
            ? "shadow-lg bg-[#27272a] border-[#3f3f46] ring-1 ring-[#3f3f46]/50" 
            : "hover:border-[#333]"
        )}
      >
        <div className="pl-2 pb-2">
           <button 
            type="button"
            className="p-2.5 rounded-full hover:bg-[#333] text-gray-400 hover:text-gray-200 transition-all"
            aria-label="Attach file"
          >
            <Paperclip weight="bold" className="w-5 h-5" />
          </button>
        </div>
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask Codefyx anything..."
          className="w-full max-h-[200px] bg-transparent border-none outline-none text-gray-100 placeholder-gray-500 text-[15px] leading-6 resize-none py-3 px-2 font-normal"
          rows={1}
          disabled={isLoading}
        />

        <div className="pr-2 pb-2">
          {!input.trim() ? (
             <button 
              type="button"
              className="p-2.5 rounded-full hover:bg-[#333] text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Use voice"
            >
              <Microphone weight="bold" className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              )}
            >
              <ArrowUp weight="bold" className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
