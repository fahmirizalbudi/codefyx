"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/src/components/chat/Sidebar';
import { ChatArea } from '@/src/components/chat/ChatArea';
import { SearchModal } from '@/src/components/modals/SearchModal';
import { ExploreModal } from '@/src/components/modals/ExploreModal';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('default');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [historyTrigger, setHistoryTrigger] = useState(0); // Counter to force refresh

  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
  };

  const handleSelectPrompt = (prompt: string) => {
    alert(`Selected prompt: ${prompt}\n(Feature: Auto-send implementation pending context wiring)`);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <Sidebar 
        onNewChat={handleNewChat}
        onSearchClick={() => setIsSearchOpen(true)}
        onExploreClick={() => setIsExploreOpen(true)}
        activeSessionId={sessionId}
        onSessionSelect={setSessionId}
        triggerUpdate={historyTrigger}
      />
      <main className="flex-1 flex flex-col relative h-full">
        <ChatArea 
          key={sessionId} 
          sessionId={sessionId} 
          onMessageSent={() => setHistoryTrigger(prev => prev + 1)}
        />
      </main>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onSelectMessage={(id) => setSessionId(id)}
      />
      
      <ExploreModal 
        isOpen={isExploreOpen} 
        onClose={() => setIsExploreOpen(false)}
        onSelectPrompt={handleSelectPrompt}
      />
    </div>
  );
}
