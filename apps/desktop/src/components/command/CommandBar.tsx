import React, { useEffect, useRef, useState } from 'react';
import { useAuraStore } from '../../store/useAuraStore';
import { sendMockCommand } from '../../services/mockApi';
import { Command, CornerDownLeft, Sparkles } from 'lucide-react';

export const CommandBar: React.FC = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { setViewMode, addMessage, setThinking } = useAuraStore();

  // Auto-focus Command Bar input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userPrompt = input.trim();
    setInput('');

    // Switch to Conversation Focus Mode
    setViewMode('conversation-focus');

    // Add user message to conversation log
    addMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    // Set AURA presence state
    setThinking(true, 'AURA is analyzing your command...');

    try {
      const response = await sendMockCommand(userPrompt);
      addMessage(response);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="p-4 bg-[#090C10] border-t border-[#1E2638] shrink-0 select-none">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-[#0F141C] border border-[#1E2638] focus-within:border-sky-400/80 focus-within:ring-1 focus-within:ring-sky-400/30 rounded-md p-3 shadow-md flex items-center gap-3 transition-all"
      >
        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-xs border-r border-[#1E2638] pr-3 shrink-0">
          <Command className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">⌘K</span>
        </div>

        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AURA or type a command... (e.g. 'Prepare me for today', 'Summarize yesterday', 'Open today\'s drawings')"
          className="flex-1 bg-transparent border-none outline-none text-xs text-slate-100 placeholder:text-slate-500 placeholder:text-xs"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send Command"
          className="bg-sky-500/15 hover:bg-sky-500/25 disabled:opacity-40 text-sky-300 border border-sky-500/40 px-3 py-1.5 rounded-sm text-xs font-medium transition-all flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span className="hidden sm:inline">Ask AURA</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
