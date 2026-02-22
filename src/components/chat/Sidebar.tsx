"use client";
import React, { useState } from "react";
import { MagnifyingGlass, Plus, SquaresFour } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Logo } from "../Logo";

interface SidebarProps {
  onNewChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  
  const history = [
    "Design Inspiration",
    "React Component Library",
    "Next.js 15 Features",
    "Tailwind CSS Tips",
    "Understanding AI Models"
  ];

  const menuItems = [
    { icon: MagnifyingGlass, label: "Search" },
    { icon: SquaresFour, label: "Explore" },
  ];

  return (
    <div className="flex flex-col h-full w-[320px] bg-black text-white py-8 hidden md:flex flex-shrink-0">
      {/* Header with New Logo */}
      <div className="flex items-center justify-between mb-8 px-8">
        <div className="flex items-center gap-3.5">
          <Logo />
          <span className="font-semibold text-[16px] tracking-wide text-white">Codefyx</span>
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
          <div className="space-y-1">
            {history.map((item, index) => (
              <button 
                key={index} 
                onClick={() => setActiveId(index)}
                className={cn(
                  "w-full text-left px-4 py-3.5 rounded-xl text-[15px] transition-all duration-200 truncate group relative overflow-hidden",
                  activeId === index 
                    ? "bg-[#1a1a1a] text-gray-100 font-medium" 
                    : "text-gray-400 hover:bg-[#1a1a1a]/50 hover:text-gray-200"
                )}
              >
                <span className="truncate relative z-10">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
