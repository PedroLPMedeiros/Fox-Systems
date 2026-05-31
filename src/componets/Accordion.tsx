"use client"
import { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Accordion({ title, children, isOpen: controlledIsOpen, onToggle }: AccordionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50 mb-4 transition-all">
      <button
        onClick={handleToggle}
        className="w-full p-4 flex justify-between items-center hover:bg-zinc-800 transition-colors group cursor-pointer"
      >
        <span className="font-bold text-lg uppercase tracking-tight">
          {title}
        </span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-fox-red' : 'text-zinc-600'}`}>
          ▼
        </span>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
      >
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
          {children}
        </div>
      </div>
    </div>
  );
}