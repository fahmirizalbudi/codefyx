"use client";

import React from 'react';
import { X, Sparkle, Code, Lightbulb, Pencil, SquaresFour } from '@phosphor-icons/react';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

const suggestions = [
  {
    icon: Code,
    title: "Refactor Code",
    prompt: "Can you help me refactor this code to be more efficient and readable?",
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    icon: Sparkle,
    title: "Explain Concept",
    prompt: "Explain the concept of React Server Components simply.",
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    icon: Lightbulb,
    title: "Brainstorm Ideas",
    prompt: "I need ideas for a SaaS application in the productivity space.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10"
  },
  {
    icon: Pencil,
    title: "Write Documentation",
    prompt: "Write technical documentation for a user authentication API.",
    color: "text-green-400",
    bg: "bg-green-400/10"
  }
];

export const ExploreModal: React.FC<ExploreModalProps> = ({ isOpen, onClose, onSelectPrompt }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 hover:bg-[#333] rounded-lg text-gray-500 hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <SquaresFour className="w-6 h-6 text-indigo-500" /> Explore
          </h2>
          <p className="text-gray-400">Discover new ways to use Codefyx.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectPrompt(item.prompt);
                onClose();
              }}
              className="flex items-start gap-4 p-4 rounded-xl border border-[#333] hover:bg-[#262626] hover:border-[#444] transition-all text-left group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                <item.icon weight="fill" className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-200 mb-1 group-hover:text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.prompt}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
