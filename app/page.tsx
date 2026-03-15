"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/src/components/chat/Sidebar';
import { ChatArea } from '@/src/components/chat/ChatArea';
import { SearchModal } from '@/src/components/modals/SearchModal';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [historyTrigger, setHistoryTrigger] = useState(0);

  useEffect(() => {
    setSessionId(crypto.randomUUID());
    
    // Auto-collapse sidebar on mobile logic
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#000000] overflow-hidden selection:bg-[#7C3AED]/30 selection:text-white">
      <Sidebar 
        onNewChat={handleNewChat}
        onSearchClick={() => setIsSearchOpen(true)}
        activeSessionId={sessionId}
        onSessionSelect={(id) => {
          setSessionId(id);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
        triggerUpdate={historyTrigger}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="flex-1 flex flex-col relative h-full w-full max-w-full overflow-hidden">
        {sessionId && (
          <ChatArea 
            key={sessionId} 
            sessionId={sessionId} 
            onMessageSent={() => setHistoryTrigger(prev => prev + 1)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}
      </main>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onSelectMessage={(id) => setSessionId(id)}
      />
    </div>
  );
}
