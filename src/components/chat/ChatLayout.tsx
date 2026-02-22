import React from 'react';
import { Sidebar } from './Sidebar';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-slate-800">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-full">
        {children}
      </main>
    </div>
  );
};
