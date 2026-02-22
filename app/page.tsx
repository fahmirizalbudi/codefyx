"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/src/components/chat/Sidebar';
import { ChatArea } from '@/src/components/chat/ChatArea';
import { SearchModal } from '@/src/components/modals/SearchModal';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [historyTrigger, setHistoryTrigger] = useState(0);

  // Initialize with a fresh session on mount
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <Sidebar 
        onNewChat={handleNewChat}
        onSearchClick={() => setIsSearchOpen(true)}
        activeSessionId={sessionId}
        onSessionSelect={setSessionId}
        triggerUpdate={historyTrigger}
      />
      <main className="flex-1 flex flex-col relative h-full">
        {/* Only render ChatArea once we have a sessionId to avoid flickering default state */}
        {sessionId && (
          <ChatArea 
            key={sessionId} 
            sessionId={sessionId} 
            onMessageSent={() => setHistoryTrigger(prev => prev + 1)}
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
