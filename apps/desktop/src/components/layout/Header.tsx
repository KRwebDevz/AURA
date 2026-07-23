import React from 'react';
import { useAuraStore } from '../../store/useAuraStore';
import { LayoutGrid, MessageSquare, Minus, Square, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { viewMode, setViewMode } = useAuraStore();

  return (
    <header className="h-10 bg-[#0F141C] border-b border-[#1E2638] flex items-center justify-between px-4 select-none shrink-0">
      {/* Brand Typography Logo */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold tracking-[0.35em] text-slate-200 uppercase">
          A U R A
        </span>
        <span className="text-[10px] text-slate-500 font-mono border-l border-[#1E2638] pl-3">
          MISSION CONTROL v0.1.0
        </span>
      </div>

      {/* Mode Toggle Controls */}
      <div className="flex items-center gap-1 bg-[#090C10] p-1 rounded-sm border border-[#1E2638]">
        <button
          onClick={() => setViewMode('mission-control')}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-sm transition-colors ${
            viewMode === 'mission-control'
              ? 'bg-[#1E2433] text-sky-400 font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Mission Control</span>
        </button>
        <button
          onClick={() => setViewMode('conversation-focus')}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-sm transition-colors ${
            viewMode === 'conversation-focus'
              ? 'bg-[#1E2433] text-sky-400 font-medium'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Focus Mode</span>
        </button>
      </div>

      {/* Window Controls */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Minimize Window"
          className="text-slate-500 hover:text-slate-300 p-1 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          aria-label="Maximize Window"
          className="text-slate-500 hover:text-slate-300 p-1 transition-colors"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          aria-label="Close Window"
          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
