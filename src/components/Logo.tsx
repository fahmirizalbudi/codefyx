import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("w-9 h-9 shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-xl", className)}
    >
      <rect width="36" height="36" rx="12" fill="white"/>
      <rect x="9" y="9" width="18" height="18" rx="4" transform="rotate(45 18 18)" fill="black"/>
    </svg>
  );
};
