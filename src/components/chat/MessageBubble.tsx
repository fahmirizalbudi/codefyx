"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, User, Robot, Check } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  if (!content || content.trim() === '') return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "w-full px-4 md:px-0 py-6 group",
      isUser ? "bg-transparent" : "bg-transparent"
    )}>
      <div className={cn(
        "flex max-w-4xl mx-auto gap-4 md:gap-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all",
          isUser 
            ? "bg-[#27272a] text-gray-400 hover:bg-[#3f3f46]" 
            : "bg-[#09090b] text-gray-300 hover:bg-[#1a1a1a]"
        )}>
          {isUser ? <User weight="bold" className="w-4 h-4" /> : <Robot weight="bold" className="w-4 h-4" /> }
        </div>

        <div className={cn(
          "flex-1 min-w-0 space-y-1.5",
          isUser ? "text-right" : "text-left"
        )}>
          <div className="font-semibold text-xs text-gray-500 tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity mb-1.5">
            {isUser ? "You" : "Codefyx AI"}
          </div>
          <div className={cn(
            "text-[15px] leading-7 text-gray-200 break-words font-normal antialiased",
             isUser 
               ? "bg-[#1a1a1a] px-5 py-3 rounded-[20px] rounded-tr-md inline-block text-left" 
               : "pl-1 w-full"
          )}>
            {isUser ? (
              content
            ) : (
              <div className="prose prose-invert max-w-none prose-p:leading-7 prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:border-0 prose-hr:border-0 prose-headings:border-0 prose-blockquote:border-0">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      const codeText = String(children).replace(/\n$/, '');
                      
                      return !inline && match ? (
                        <div className="relative group/code my-4 rounded-xl overflow-hidden bg-[#0d0d0d]">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#151515] text-xs">
                            <span className="text-gray-500 font-medium font-mono">{match[1]}</span>
                            <button 
                              onClick={() => handleCopy(codeText)}
                              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-200 transition-colors"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                              {copied ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="custom-scrollbar overflow-x-auto">
                            <SyntaxHighlighter
                              {...props}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, borderRadius: 0, background: 'transparent', fontSize: '14px', padding: '1rem' }}
                            >
                              {codeText}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      ) : (
                        <code {...props} className={cn("bg-[#1a1a1a] text-[#e5e7eb] px-1.5 py-0.5 rounded font-mono text-[13px]", className)}>
                          {children}
                        </code>
                      )
                    },
                    hr() {
                      return <div className="my-8 h-px bg-[#27272a]" />
                    },
                    table({children}) {
                      return (
                        <div className="overflow-x-auto my-6 rounded-lg bg-[#111] custom-scrollbar">
                          <table className="min-w-full text-sm text-gray-300">
                            {children}
                          </table>
                        </div>
                      )
                    },
                    thead({children}) {
                      return <thead className="bg-[#1a1a1a] font-semibold text-left text-gray-400">{children}</thead>
                    },
                    th({children}) {
                      return <th className="px-4 py-3 font-medium">{children}</th>
                    },
                    td({children}) {
                      return <td className="px-4 py-3 border-t border-[#1a1a1a]">{children}</td>
                    },
                    p({children}) {
                      return <p className="mb-4 last:mb-0">{children}</p>
                    },
                    ul({children}) {
                      return <ul className="list-disc pl-5 mb-4 space-y-1 marker:text-gray-600">{children}</ul>
                    },
                    ol({children}) {
                      return <ol className="list-decimal pl-5 mb-4 space-y-1 marker:text-gray-600">{children}</ol>
                    },
                    a({children, href}) {
                      return <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">{children}</a>
                    },
                    blockquote({children}) {
                      return <blockquote className="border-l-2 border-[#333] pl-4 italic text-gray-500 my-4">{children}</blockquote>
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {!isUser && (
            <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity justify-start pl-1">
              <button 
                onClick={() => handleCopy(content)}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2" 
                title="Copy response"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied && <span className="text-xs text-green-400">Copied</span>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
