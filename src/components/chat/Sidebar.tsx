"use client";
import React, { useEffect, useState } from "react";
import { ChatCircleText, MagnifyingGlass, Plus, SquaresFour } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Logo } from "../Logo";
import { supabase } from "@/src/lib/supabaseClient";

interface SidebarProps {
  onNewChat?: () => void;
}

interface HistoryItem {
  id: string;
  content: string;
  created_at: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, created_at')
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel('sidebar_history')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'role=eq.user' }, (payload) => {
        const newItem = payload.new as HistoryItem;
        setHistory(prev => [newItem, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const menuItems = [
    { icon: MagnifyingGlass, label: "Search" },
    { icon: SquaresFour, label: "Explore" },
  ];

  return (
    <div className="flex flex-col h-full w-[320px] bg-black text-white py-8 hidden md:flex flex-shrink-0 border-r border-[#1a1a1a]">
      {/* Header with New Logo */}
      <div className="flex items-center justify-between mb-8 px-8">
        <div className="flex items-center gap-3.5">
          <Logo />
          <span className="font-semibold text-[18px] tracking-wide text-white">Codefyx</span>
        </div>
      </div>

      {/* Main Action & Menu */}
      <div className="flex-1 overflow-hidden flex flex-col gap-1.5 px-4">
        <div className="space-y-1 mb-6">
          <button 
            onClick={onNewChat}
            className="w-full text-left px-4 py-3.5 rounded-xl text-[15px] text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-100 transition-colors flex items-center gap-4 group"
          >
            <Plus weight="bold" className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
            <span>New chat</span>
          </button>
          
          {menuItems.map((item) => (
            <button 
              key={item.label}
              className="w-full text-left px-4 py-3.5 rounded-xl text-[15px] text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-100 transition-colors flex items-center gap-4 group"
            >
              <item.icon weight="bold" className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar -mr-2 pr-2">
          {history.length > 0 ? (
            <div className="space-y-1">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">Recent</h3>
              {history.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "w-full text-left px-4 py-3.5 rounded-xl text-[15px] transition-all duration-200 truncate group relative overflow-hidden flex items-center gap-3",
                    activeId === item.id 
                      ? "bg-[#1a1a1a] text-gray-100 font-medium" 
                      : "text-gray-400 hover:bg-[#1a1a1a]/50 hover:text-gray-200"
                  )}
                >
                  <ChatCircleText weight="regular" className="w-4 h-4 shrink-0 text-gray-600 group-hover:text-gray-400" />
                  <span className="truncate relative z-10">{item.content}</span>
                </button>
              ))}
            </div>
          ) : (
             <div className="text-center text-gray-600 text-[13px] mt-8 italic opacity-40">
               No recent chats
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
