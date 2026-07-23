import React, { useEffect, useRef } from 'react';
import { ConversationMessage } from '../../types';
import { AlertCircle, Bot, FolderGit2, HardDrive, History, Loader2, User } from 'lucide-react';

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
    <div className="flex-1 overflow-hidden flex gap-6 max-w-6xl mx-auto w-full py-4">
      {/* Primary Transcript Stream Area */}
      <div className="flex-1 flex flex-col overflow-y-auto pr-2 space-y-6">
        <div className="border-b border-[#1E2638] pb-3 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Conversation Canvas
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Focus Mode • Executive Transcript
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-[#0F141C] border border-[#1E2638] px-2.5 py-1 rounded-sm">
            ENDPOINT: POST /conversation (OLLAMA LLAMA3.2)
          </span>
        </div>

        {/* Message Log Loop */}
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant' || msg.role === 'system';
          const isError = msg.status === 'error';

          return (
            <div
              key={msg.id}
              className={`space-y-1.5 ${
                isAssistant ? 'text-left' : 'text-right max-w-2xl ml-auto'
              }`}
            >
              {/* Header / Badge */}
              <div
                className={`flex items-center gap-2 text-xs ${
                  isAssistant ? 'justify-start' : 'justify-end'
                }`}
              >
                {isAssistant ? (
                  <>
                    <div
                      className={`w-5 h-5 rounded-sm flex items-center justify-center ${
                        isError
                          ? 'bg-red-950/40 border border-red-800/60'
                          : 'bg-sky-500/10 border border-sky-500/30'
                      }`}
                    >
                      {isError ? (
                        <AlertCircle className="w-3 h-3 text-red-400" />
                      ) : (
                        <Bot className="w-3 h-3 text-sky-400" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold text-xs tracking-widest uppercase ${
                          isError ? 'text-red-400' : 'text-sky-400'
                        }`}
                      >
                        A U R A
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 leading-none mt-0.5">
                        {msg.createdAt}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-slate-300 text-xs">
                        EXECUTIVE USER
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 leading-none mt-0.5">
                        {msg.createdAt}
                      </span>
                    </div>
                    <div className="w-5 h-5 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-300" />
                    </div>
                  </>
                )}
              </div>

              {/* Transcript Box (No Chat Bubbles) */}
              <div
                className={`p-4 rounded-md text-xs leading-relaxed ${
                  isError
                    ? 'bg-red-950/20 border border-red-900/50 text-red-300'
                    : isAssistant
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

      {/* Reserved Context Drawer (Right-hand Column for Future Extension) */}
      <div className="w-64 hidden lg:flex flex-col gap-4 shrink-0 border-l border-[#1E2638] pl-6 select-none">
        <div className="bg-[#0F141C] border border-[#1E2638] rounded-md p-4 space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            Active Context
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Workspace:</span>
              <span className="text-slate-200 font-medium font-mono">Trading</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Model:</span>
              <span className="text-slate-200 font-mono">llama3.2</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Memory Window:</span>
              <span className="text-emerald-400 font-mono">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0F141C] border border-[#1E2638] rounded-md p-4 space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
            Relevant Files
          </h3>
          <p className="text-[11px] text-slate-500 italic">
            No active files attached to current thread.
          </p>
        </div>

        <div className="bg-[#0F141C] border border-[#1E2638] rounded-md p-4 space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-400" />
            Recent Memories
          </h3>
          <p className="text-[11px] text-slate-500 italic">
            Capgemini architecture notes staged.
          </p>
        </div>
      </div>
    </div>
  );
};
