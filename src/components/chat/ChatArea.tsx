"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { InputArea } from './InputArea';
import { MessageBubble } from './MessageBubble';
import { supabase } from '@/src/lib/supabaseClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Supabase Error:', error);
        } else if (data) {
          // Filter out empty messages from DB
          const validMessages = data.filter((msg: any) => msg.content && msg.content.trim() !== '');
          setMessages(validMessages as any);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel('messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as Message;
        if (!newMsg.content || newMsg.content.trim() === '') return;

        setMessages((prev) => {
          // Prevent duplicates from optimistic updates
          const exists = prev.some(m => m.id === newMsg.id || (m.role === newMsg.role && m.content === newMsg.content && m.id.length > 10)); // Simple duplicate check
          if (exists) return prev;
          return [...prev, newMsg];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSend = async (content: string) => {
    if (!content || content.trim() === '') return;

    // 1. Optimistic Update
    const tempId = Date.now().toString();
    const userMsg: Message = { id: tempId, role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Save User Message
      const { error: saveError } = await supabase
        .from('messages')
        .insert([{ role: 'user', content }]);

      if (saveError) throw new Error("Failed to save message: " + saveError.message);

      // 3. Call AI API
      // Send context (excluding temporary error messages)
      const contextMessages = messages.filter(m => m.id !== 'error');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...contextMessages, userMsg] }),
      });

      if (!response.ok) throw new Error('AI API Failed');

      const data = await response.json();
      const aiContent = data.content;

      if (!aiContent || aiContent.trim() === '') throw new Error('Empty response from AI');

      // 4. Save AI Response
      const { error: aiSaveError } = await supabase
        .from('messages')
        .insert([{ role: 'assistant', content: aiContent }]);

      if (aiSaveError) throw aiSaveError;

      // Force refresh to get exact server state (optional but safer for IDs)
      const { data: latestData } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (latestData) {
         const validMessages = latestData.filter((msg: any) => msg.content && msg.content.trim() !== '');
         setMessages(validMessages as any);
      }

    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] text-gray-200 relative overflow-hidden">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto w-full custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto w-full px-6 md:px-0 pt-10 pb-40 space-y-8">
          
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id || msg.created_at || Math.random()} 
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
          <div ref={scrollRef} />
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
