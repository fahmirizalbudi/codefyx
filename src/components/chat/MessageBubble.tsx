"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy01Icon, UserIcon, Robot01Icon, Tick01Icon } from 'hugeicons-react';
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
      "w-full px-4 md:px-0 py-6 group transition-colors duration-200 bg-transparent"
    )}>
      <div className={cn(
        "flex max-w-4xl mx-auto gap-4 md:gap-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
          isUser 
            ? "bg-[#1e1e1e] text-gray-300" 
            : "bg-[#06B6D4] text-white"
        )}>
          {isUser ? <UserIcon size={18} /> : <Robot01Icon size={18} /> }
        </div>

        <div className={cn(
          "flex-1 min-w-0 space-y-1.5",
          isUser ? "text-right" : "text-left"
        )}>
          <div className="font-semibold text-xs text-gray-500 tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1.5">
            {isUser ? "You" : "Codefyx AI"}
          </div>
          <div className={cn(
            "text-[15px] leading-7 text-gray-200 break-words font-normal antialiased",
             isUser 
               ? "inline-block text-left py-2" 
               : "w-[calc(100%-2rem)] md:w-full py-2"
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
                        <div className="relative group/code my-4 rounded-xl overflow-hidden bg-[#0a0a0a] shadow-lg border border-[#1e1e1e]">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#141414] text-xs border-b border-[#1e1e1e]">
                            <span className="text-gray-400 font-medium font-mono">{match[1]}</span>
                            <button 
                              onClick={() => handleCopy(codeText)}
                              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-200 transition-colors duration-200 cursor-pointer"
                            >
                              {copied ? <Tick01Icon className="w-3.5 h-3.5 text-green-400" /> : <Copy01Icon className="w-3.5 h-3.5" />}
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
                        <code {...props} className={cn("bg-[#1a1a1a] text-[#e5e7eb] px-1.5 py-0.5 rounded font-mono text-[13px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]", className)}>
                          {children}
                        </code>
                      )
                    },
                    hr() {
                      return <div className="my-8 h-px bg-[#2a2a2a]" />
                    },
                    table({children}) {
                      return (
                        <div className="overflow-x-auto my-6 rounded-xl bg-[#141414] shadow-md custom-scrollbar ring-0">
                          <table className="min-w-full text-sm text-gray-300">
                            {children}
                          </table>
                        </div>
                      )
                    },
                    thead({children}) {
                      return <thead className="bg-[#1e1e1e] font-semibold text-left text-gray-400">{children}</thead>
                    },
                    th({children}) {
                      return <th className="px-4 py-3 font-medium">{children}</th>
                    },
                    td({children}) {
                      return <td className="px-4 py-3">{children}</td>
                    },
                    p({children}) {
                      return <p className="mb-4 last:mb-0 text-gray-200">{children}</p>
                    },
                    ul({children}) {
                      return <ul className="list-disc pl-5 mb-4 space-y-1 marker:text-gray-600 text-gray-200">{children}</ul>
                    },
                    ol({children}) {
                      return <ol className="list-decimal pl-5 mb-4 space-y-1 marker:text-gray-600 text-gray-200">{children}</ol>
                    },
                    a({children, href}) {
                      return <a href={href} target="_blank" rel="noreferrer" className="text-[#06B6D4] hover:text-[#22d3ee] transition-colors underline decoration-transparent hover:decoration-[#06B6D4] underline-offset-4">{children}</a>
                    },
                    blockquote({children}) {
                      return <blockquote className="border-l-2 border-[#06B6D4] pl-4 italic text-gray-400 my-4 bg-[#0a0a0a]/50 py-2 rounded-r-lg">{children}</blockquote>
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {!isUser && (
            <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 justify-start pl-1">
              <button 
                onClick={() => handleCopy(content)}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg text-gray-500 hover:text-gray-300 transition-colors duration-200 flex items-center gap-2 cursor-pointer shadow-sm ring-0" 
                title="Copy response"
              >
                {copied ? <Tick01Icon className="w-4 h-4 text-green-400" /> : <Copy01Icon className="w-4 h-4" />}
                {copied && <span className="text-xs text-green-400 font-medium">Copied</span>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
