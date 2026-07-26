import React, { useEffect, useRef, useState } from 'react';
import { useConversation } from '../../features/conversation/hooks/useConversation';
import { Command, CornerDownLeft, Loader2, Sparkles, Square, Zap } from 'lucide-react';

export const CommandBar: React.FC = () => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, cancelGeneration, isThinking, assistantState } = useConversation();

  const isRequestActive = isThinking || assistantState === 'STREAMING';

  // Auto-focus Command Bar input on mount & after completion
  useEffect(() => {
    if (!isRequestActive) {
      textareaRef.current?.focus();
    }
  }, [isRequestActive]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (isRequestActive) {
      cancelGeneration();
      return;
    }
    if (!input.trim()) return;
    const textToSend = input;
    setInput('');
    await sendMessage(textToSend);
    textareaRef.current?.focus();
  };

  const getPlaceholder = () => {
    if (assistantState === 'THINKING') return 'AURA is analyzing request... (Press Stop to cancel)';
    if (assistantState === 'STREAMING') return 'AURA is streaming response... (Press Stop to cancel)';
    return 'Ask AURA or type a command... (Press Enter to send, Shift+Enter for newline)';
  };

  return (
    <div className="p-4 bg-[#090C10] border-t border-[#1E2638] shrink-0 select-none">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className={`max-w-4xl mx-auto bg-[#0F141C] border rounded-md p-3 shadow-md flex items-end gap-3 transition-all ${
          isRequestActive
            ? 'border-sky-500/60 ring-1 ring-sky-500/20'
            : 'border-[#1E2638] focus-within:border-sky-400/80 focus-within:ring-1 focus-within:ring-sky-400/30'
        }`}
      >
        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-xs border-r border-[#1E2638] pr-3 shrink-0 pb-1">
          <Command className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">⌘K</span>
        </div>

        <textarea
          ref={textareaRef}
          disabled={isRequestActive}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={getPlaceholder()}
          className="flex-1 bg-transparent border-none outline-none text-xs text-slate-100 placeholder:text-slate-500 placeholder:text-xs resize-none max-h-32 py-1 disabled:cursor-not-allowed"
        />

        {isRequestActive ? (
          <button
            type="button"
            onClick={cancelGeneration}
            aria-label="Stop Generation"
            title="Stop generation & speaking"
            className="bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 px-3 py-1.5 rounded-sm text-xs font-medium transition-all flex items-center gap-1.5 shrink-0"
          >
            {assistantState === 'THINKING' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 animate-pulse text-red-400" />
            )}
            <span className="hidden sm:inline font-mono">Stop</span>
            <Square className="w-3 h-3 fill-current text-red-400" />
          </button>
        ) : (
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
        )}
      </form>
    </div>
  );
};
