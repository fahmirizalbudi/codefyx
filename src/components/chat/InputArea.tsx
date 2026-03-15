"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Attachment01Icon, ArrowUp01Icon, Cancel01Icon, SourceCodeIcon } from 'hugeicons-react';
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

    if (finalMessage.trim() || attachment) {
      onSend(finalMessage || "Please analyze the attached file.");
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
        <div className="flex items-center gap-3 bg-[#1e1e1e] self-start px-3 py-2 rounded-xl shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 ring-0 border-none">
          <div className="w-8 h-8 bg-[#0a0a0a] rounded-lg flex items-center justify-center ring-0 border-none shadow-sm">
            <SourceCodeIcon className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-200 font-medium max-w-[200px] truncate">{attachment.name}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Code / Text</span>
          </div>
          <button 
            onClick={removeAttachment}
            className="ml-2 p-1.5 hover:bg-[#2a2a2a] rounded-full text-gray-500 hover:text-red-400 transition-colors duration-200 cursor-pointer"
          >
            <Cancel01Icon className="w-4 h-4" />
          </button>
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative w-full bg-[#141414] rounded-[24px] p-2 flex items-end gap-2 transition-all duration-300 ring-0",
          isFocused 
            ? "shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-[#1a1a1a]" 
            : "shadow-[0_4px_20px_rgb(0,0,0,0.3)] hover:bg-[#1a1a1a]"
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
            className="p-2.5 rounded-full hover:bg-[#2a2a2a] text-gray-400 hover:text-gray-200 transition-all duration-200 cursor-pointer"
            title="Attach code or text file"
          >
            <Attachment01Icon className="w-5 h-5" />
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
              "p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm cursor-pointer",
              (!input.trim() && !attachment) || isLoading 
                ? "bg-[#222] text-gray-600 cursor-not-allowed shadow-none"
                : "bg-[#06B6D4] text-white hover:bg-[#0891b2] hover:shadow-md hover:-translate-y-px"
            )}
          >
            <ArrowUp01Icon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
