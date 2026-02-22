"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { InputArea } from './InputArea';
import { MessageBubble } from './MessageBubble';
import { supabase } from '@/src/lib/supabaseClient';
import { CircleNotch } from '@phosphor-icons/react';

interface ChatAreaProps {
  sessionId: string;
  onMessageSent?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
  session_id?: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ sessionId, onMessageSent }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchMessages = async () => {
      setMessages([]); 
      try {
        let query = supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (sessionId) {
           query = query.eq('session_id', sessionId);
        }

        const { data, error } = await query;

        if (error) {
          if (error.code === '42703') { 
             const { data: fallbackData } = await supabase
              .from('messages')
              .select('*')
              .order('created_at', { ascending: true });
             
             if (fallbackData) {
                const validMessages = fallbackData.filter((msg: any) => msg.content && msg.content.trim() !== '');
                setMessages(validMessages as any);
             }
          }
        } else if (data) {
          const validMessages = data.filter((msg: any) => msg.content && msg.content.trim() !== '');
          setMessages(validMessages as any);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`session_${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as Message;
        if (!newMsg.content || newMsg.content.trim() === '') return;
        
        if (sessionId !== 'default' && newMsg.session_id && newMsg.session_id !== sessionId) return;

        setMessages((prev) => {
          const exists = prev.some(m => m.id === newMsg.id);
          if (exists) return prev;
          return [...prev, newMsg];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleSend = async (content: string) => {
    if (!content || content.trim() === '') return;

    const tempId = Date.now().toString();
    const userMsg: Message = { id: tempId, role: 'user', content, session_id: sessionId };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const { error: saveError } = await supabase
        .from('messages')
        .insert([{ role: 'user', content, session_id: sessionId }]);

      if (saveError && saveError.code !== '42703') {
         throw new Error("Failed to save message: " + saveError.message);
      } else if (saveError && saveError.code === '42703') {
         await supabase.from('messages').insert([{ role: 'user', content }]);
      }

      if (onMessageSent) onMessageSent();

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

      const { error: aiSaveError } = await supabase
        .from('messages')
        .insert([{ role: 'assistant', content: aiContent, session_id: sessionId }]);

      if (aiSaveError && aiSaveError.code === '42703') {
         await supabase.from('messages').insert([{ role: 'assistant', content: aiContent }]);
      } else if (aiSaveError) {
         throw aiSaveError;
      }

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: aiContent, 
        session_id: sessionId 
      };
      
      setMessages(prev => {
        if (prev.some(m => m.content === aiMsg.content && m.role === 'assistant')) return prev;
        return [...prev, aiMsg];
      });

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] text-gray-200 relative overflow-hidden">
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
              <CircleNotch weight="bold" className="w-5 h-5 text-indigo-500 animate-spin" />
              <span className="text-sm text-gray-500">Codefyx is thinking...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

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
