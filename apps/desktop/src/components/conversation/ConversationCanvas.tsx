import React, { useEffect, useRef } from 'react';
import { ConversationMessage } from '../../types';
import { Bot, Loader2, User } from 'lucide-react';

interface ConversationCanvasProps {
  messages: ConversationMessage[];
  isThinking: boolean;
  presenceState: string;
}

export const ConversationCanvas: React.FC<ConversationCanvasProps> = ({
  messages,
  isThinking,
  presenceState,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-4xl mx-auto w-full">
      <div className="border-b border-[#1E2638] pb-3 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Conversation Canvas
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Focus Mode • Executive Transcript
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-[#0F141C] border border-[#1E2638] px-2.5 py-1 rounded-sm">
          PROVIDER: OLLAMA (LLAMA3.2)
        </span>
      </div>

      {/* Message Log Loop */}
      {messages.map((msg) => {
        const isAura = msg.role === 'aura';

        return (
          <div
            key={msg.id}
            className={`space-y-1.5 ${
              isAura ? 'text-left' : 'text-right max-w-2xl ml-auto'
            }`}
          >
            {/* Header / Badge */}
            <div
              className={`flex items-center gap-2 text-xs ${
                isAura ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAura ? (
                <>
                  <div className="w-5 h-5 rounded-sm bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-sky-400" />
                  </div>
                  <span className="font-semibold text-sky-400 text-xs tracking-widest uppercase">
                    A U R A
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {msg.timestamp}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-mono text-slate-500">
                    {msg.timestamp}
                  </span>
                  <span className="font-medium text-slate-300 text-xs">
                    EXECUTIVE USER
                  </span>
                  <div className="w-5 h-5 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <User className="w-3 h-3 text-slate-300" />
                  </div>
                </>
              )}
            </div>

            {/* Transcript Box (No Chat Bubbles) */}
            <div
              className={`p-4 rounded-md text-xs leading-relaxed ${
                isAura
                  ? 'bg-[#161B26] border border-[#1E2638] text-slate-100'
                  : 'bg-[#1E2433] border border-[#334155] text-slate-100 font-medium'
              }`}
            >
              {msg.content}
            </div>
          </div>
        );
      })}

      {/* AURA Presence Thinking Indicator */}
      {isThinking && (
        <div className="flex items-center gap-2 text-xs text-sky-400 bg-sky-950/20 border border-sky-800/40 p-3 rounded-md animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          <span className="font-mono text-xs">{presenceState}</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
