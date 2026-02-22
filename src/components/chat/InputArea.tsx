"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, ArrowUp, X, FileText } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

interface Attachment {
  name: string;
  content: string;
  type: string;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('text/') || file.name.match(/\.(js|jsx|ts|tsx|json|md|css|html|py|java|c|cpp|rb|go|rs|php)$/)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment({
          name: file.name,
          content: event.target?.result as string,
          type: file.type
        });
      };
      reader.readAsText(file);
    } else {
      alert("Currently only text and code files are supported for context.");
    }
    
    e.target.value = '';
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!input.trim() && !attachment) || isLoading) return;

    let finalMessage = input;
    
    if (attachment) {
      finalMessage = `${input.trim()}\n\n---\n**Attached File:** \`${attachment.name}\`\n\`\`\`\n${attachment.content}\n\`\`\`\n---`;
    }

    if (finalMessage.trim()) {
      onSend(finalMessage);
      setInput('');
      setAttachment(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="w-full relative group flex flex-col gap-2">
      {attachment && (
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#27272a] self-start px-3 py-2 rounded-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="w-8 h-8 bg-[#27272a] rounded-lg flex items-center justify-center">
            <FileText weight="fill" className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-200 font-medium max-w-[200px] truncate">{attachment.name}</span>
            <span className="text-[10px] text-gray-500">Text file</span>
          </div>
          <button 
            onClick={removeAttachment}
            className="ml-2 p-1 hover:bg-[#333] rounded-full text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative w-full bg-[#1a1a1a] rounded-[24px] p-2 flex items-end gap-2 transition-all duration-300 border border-[#27272a]",
          isFocused 
            ? "shadow-lg bg-[#27272a] border-[#3f3f46] ring-1 ring-[#3f3f46]/50" 
            : "hover:border-[#333]"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileSelect}
          accept=".txt,.md,.js,.jsx,.ts,.tsx,.json,.css,.html,.py,.java,.c,.cpp,.rb,.go,.rs,.php"
        />

        <div className="pb-1.5 pl-2"> 
           <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-full hover:bg-[#333] text-gray-400 hover:text-gray-200 transition-all tooltip"
            title="Attach code or text file"
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
          className="w-full max-h-[200px] bg-transparent border-none outline-none text-gray-100 placeholder-gray-500 text-[15px] leading-6 resize-none py-3.5 px-2 font-normal custom-scrollbar"
          rows={1}
          disabled={isLoading}
          style={{ overflowY: 'hidden' }}
        />

        <div className="pb-1.5 pr-2">
          <button 
            type="submit"
            disabled={(!input.trim() && !attachment) || isLoading}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm",
              (!input.trim() && !attachment) || isLoading 
                ? "bg-[#27272a] text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200"
            )}
          >
            <ArrowUp weight="bold" className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
