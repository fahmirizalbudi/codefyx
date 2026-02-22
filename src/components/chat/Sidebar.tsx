"use client";

import React, { useState, useEffect } from 'react';
import { MagnifyingGlass, Plus, SquaresFour, ChatCircle } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import { Logo } from '../Logo';
import { supabase } from '@/src/lib/supabaseClient';

interface SidebarProps {
  onNewChat: () => void;
  onSearchClick: () => void;
  onExploreClick: () => void;
  activeSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  triggerUpdate?: number; // New prop to force refresh
}

interface HistoryItem {
  id: string;
  content: string;
  created_at: string;
  session_id: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  onSearchClick, 
  onExploreClick, 
  activeSessionId, 
  onSessionSelect,
  triggerUpdate
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('id, content, created_at, session_id')
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        const uniqueSessions = Array.from(new Map(data.map(item => [item.session_id || 'default', item])).values());
        setHistory(uniqueSessions);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  // Fetch on mount and when triggerUpdate changes
  useEffect(() => {
    fetchHistory();
  }, [triggerUpdate]);

  // Keep Realtime as a backup
  useEffect(() => {
    const channel = supabase
      .channel('sidebar_history')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'role=eq.user' }, (payload) => {
        const newItem = payload.new as HistoryItem;
        setHistory(prev => {
          const filtered = prev.filter(item => (item.session_id || 'default') !== (newItem.session_id || 'default'));
          return [newItem, ...filtered];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const menuItems = [
    { icon: MagnifyingGlass, label: "Search", action: onSearchClick },
    { icon: SquaresFour, label: "Explore", action: onExploreClick },
  ];

  return (
    <div className="flex flex-col h-full w-[300px] bg-black text-white py-6 pl-4 pr-2 hidden md:flex flex-shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-8 px-2">
        <Logo />
        <span className="font-semibold text-[16px] tracking-wide text-white">Codefyx</span>
      </div>

      {/* Main Action */}
      <div className="flex flex-col gap-1 mb-2">
        <button 
          onClick={onNewChat}
          className="w-full text-left px-3 py-3 rounded-xl text-[15px] text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-100 transition-colors flex items-center gap-3.5 group"
        >
          <Plus weight="bold" className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
          <span>New chat</span>
        </button>
        
        {menuItems.map((item) => (
          <button 
            key={item.label}
            onClick={item.action}
            className="w-full text-left px-3 py-3 rounded-xl text-[15px] text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-100 transition-colors flex items-center gap-3.5 group"
          >
            <item.icon weight="bold" className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="flex-1 flex flex-col min-h-0 pt-2">
        <h3 className="px-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">History</h3>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
          {history.length > 0 && (
            <div className="flex flex-col gap-1">
              {history.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => onSessionSelect(item.session_id || 'default')}
                  className={cn(
                    "w-full text-left px-3 py-3 rounded-xl text-[15px] transition-all duration-200 truncate group relative flex items-center gap-3.5",
                    activeSessionId === (item.session_id || 'default') 
                      ? "bg-[#1a1a1a] text-gray-100" 
                      : "text-gray-400 hover:bg-[#1a1a1a]/50 hover:text-gray-200"
                  )}
                >
                  <ChatCircle weight="regular" className="w-5 h-5 shrink-0 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  <span className="truncate">{item.content}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
