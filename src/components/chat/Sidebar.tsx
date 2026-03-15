"use client";
import React, { useEffect, useRef, useState } from "react";
import { Comment01Icon, Search01Icon, PlusSignIcon, Delete01Icon } from "hugeicons-react";
import { cn } from "../../lib/utils";
import { Logo } from "../Logo";
import { supabase } from "@/src/lib/supabaseClient";

interface SidebarProps {
  onNewChat: () => void;
  onSearchClick: () => void;
  activeSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  triggerUpdate?: number;
  isOpen: boolean;
  onToggle: () => void;
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
  activeSessionId, 
  onSessionSelect,
  triggerUpdate,
  isOpen,
  onToggle
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, sessionId: string } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

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
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [triggerUpdate]);

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

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, sessionId });
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!sessionId) return;
    setHistory(prev => prev.filter(h => (h.session_id || 'default') !== sessionId));
    try {
      await supabase.from('messages').delete().eq('session_id', sessionId);
      if (activeSessionId === sessionId) {
        onNewChat();
      }
    } catch (err) {
      console.error(err);
      fetchHistory();
    }
  };

  const menuItems = [
    { icon: Search01Icon, label: "Search", action: onSearchClick },
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 md:relative flex flex-col h-full w-[320px] bg-[#0f0f0f] text-white py-6 pl-4 pr-2 flex-shrink-0 transition-transform duration-300 ease-in-out font-sans",
          isOpen ? "translate-x-0" : "-translate-x-full md:absolute flex" 
        )}
      >
      <div className="flex items-center gap-3.5 mb-8 px-2 cursor-pointer transition-opacity hover:opacity-80">
        <Logo />
        <span className="font-semibold text-[16px] tracking-wide text-white">Codefyx</span>
      </div>

      <div className="flex flex-col gap-1 mb-2 mr-2">
        <button 
          onClick={onNewChat}
          className="w-full text-left px-3 py-3 rounded-xl text-[15px] font-medium text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-100 transition-colors duration-200 flex items-center gap-3.5 group cursor-pointer"
        >
          <PlusSignIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors duration-200" />
          <span>New chat</span>
        </button>
        
        {menuItems.map((item) => (
          <button 
            key={item.label}
            onClick={item.action}
            className="w-full text-left px-3 py-3 rounded-xl text-[15px] font-medium text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-100 transition-colors duration-200 flex items-center gap-3.5 group cursor-pointer"
          >
            <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors duration-200" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-h-0 pt-6">
        <h3 className="px-3 text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-4">History</h3>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar mr-2 relative">
          {history.length > 0 && (
            <div className="flex flex-col gap-1">
              {history.map((item) => (
                <div key={item.id} onContextMenu={(e) => handleContextMenu(e, item.session_id || 'default')}>
                  <button 
                    onClick={() => onSessionSelect(item.session_id || 'default')}
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 truncate group relative flex items-center gap-3.5 cursor-pointer",
                      activeSessionId === (item.session_id || 'default') 
                        ? "bg-[#1e1e1e] text-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.1)]" 
                        : "text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200"
                    )}
                  >
                    <Comment01Icon className={cn(
                        "w-4 h-4 shrink-0 transition-colors duration-200",
                        activeSessionId === (item.session_id || 'default') ? "text-gray-300" : "text-gray-500 group-hover:text-gray-400"
                    )} />
                    <span className="truncate">
                      {item.content.length > 25
                        ? item.content.slice(0, 25) + "..."
                        : item.content}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <div 
          ref={contextMenuRef}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-40 bg-[#1e1e1e] rounded-xl shadow-[0_10px_15px_rgba(0,0,0,0.3)] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/10"
        >
          <button 
            onClick={() => handleDeleteSession(contextMenu.sessionId)}
            className="w-full text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-[#2a1a1a] hover:text-red-400 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Delete01Icon className="w-4 h-4" />
            Delete Chat
          </button>
        </div>
      )}
    </div>
    
    {/* Mobile Overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300"
        onClick={onToggle}
      />
    )}
    </>
  );
};
