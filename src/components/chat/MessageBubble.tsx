"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, ThumbsUp, ThumbsDown, ArrowCounterClockwise, User, Robot } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  const isUser = role === 'user';

  if (!content || content.trim() === '') return null;

  return (
    <div className={cn(
      "w-full px-4 md:px-0 py-6 group",
      isUser ? "bg-transparent" : "bg-transparent"
    )}>
      <div className={cn(
        "flex max-w-4xl mx-auto gap-4 md:gap-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all",
          isUser 
            ? "bg-[#27272a] text-gray-400 hover:bg-[#3f3f46] border border-[#333]" 
            : "bg-[#09090b] text-gray-300 border border-[#333] hover:border-[#444]"
        )}>
          {isUser ? <User weight="bold" className="w-4 h-4" /> : <Robot weight="bold" className="w-4 h-4" /> }
        </div>

        {/* Content */}
        <div className={cn(
          "flex-1 min-w-0 space-y-1.5",
          isUser ? "text-right" : "text-left"
        )}>
          <div className="font-semibold text-xs text-gray-500 tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity mb-1.5">
            {isUser ? "You" : "Codefyx AI"}
          </div>
          <div className={cn(
            "text-[15px] leading-7 text-gray-200 break-words font-normal antialiased prose prose-invert max-w-none prose-p:leading-7 prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-[#333] prose-pre:rounded-xl",
             isUser ? "bg-[#1a1a1a] border border-[#27272a] px-5 py-3 rounded-[20px] rounded-tr-md inline-block text-left shadow-sm" : "pl-1"
          )}>
            {isUser ? (
              content
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
          </div>
          
          {!isUser && (
            <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity justify-start pl-1">
              <button className="p-1.5 hover:bg-[#1a1a1a] rounded-md text-gray-500 hover:text-gray-300 transition-colors" aria-label="Copy">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-[#1a1a1a] rounded-md text-gray-500 hover:text-gray-300 transition-colors" aria-label="Regenerate">
                <ArrowCounterClockwise className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3 bg-[#333] mx-1.5" />
              <button className="p-1.5 hover:bg-[#1a1a1a] rounded-md text-gray-500 hover:text-gray-300 transition-colors" aria-label="Good response">
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-[#1a1a1a] rounded-md text-gray-500 hover:text-gray-300 transition-colors" aria-label="Bad response">
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
