"use client";

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { InputArea } from './InputArea';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi there! I'm Codefyx, your coding assistant. How can I help you build something amazing today?"
  }
];

export const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm a large language model trained by Codefyx. I can answer your questions, write code, and more. What would you like to explore?"
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] text-gray-200 relative overflow-hidden">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto w-full custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto w-full px-6 md:px-0 pt-10 pb-40 space-y-8">
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              role={msg.role}
              content={msg.content}
            />
          ))}
          {isLoading && (
            <div className="px-4 py-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300" />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent pt-20">
        <div className="max-w-4xl mx-auto w-full">
           <InputArea onSend={handleSend} isLoading={isLoading} />
           <p className="text-center text-[10px] text-gray-600 mt-4 font-mono tracking-wide">
             Codefyx AI can make mistakes. Consider checking important information.
           </p>
        </div>
      </div>
    </div>
  );
};
