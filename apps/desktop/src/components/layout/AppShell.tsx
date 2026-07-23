import React from 'react';
import { Header } from './Header';
import { StatusHud } from './StatusHud';
import { CommandBar } from '../command/CommandBar';
import { DailyBriefing } from '../mission-control/DailyBriefing';
import { ConversationCanvas } from '../conversation/ConversationCanvas';
import { useAuraStore } from '../../store/useAuraStore';
import { mockBriefingData } from '../../services/mockApi';

export const AppShell: React.FC = () => {
  const { viewMode, messages, isThinking, presenceState, setViewMode, addMessage, setThinking } =
    useAuraStore();

  const handleSelectPrompt = (prompt: string) => {
    setViewMode('conversation-focus');
    addMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
    setThinking(true, 'AURA is processing your request...');
    setTimeout(() => {
      addMessage({
        id: `aura-${Date.now()}`,
        role: 'aura',
        content: `Sir, I have prepared your briefing materials for "${prompt}". All relevant items are loaded.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        model: 'llama3.2',
        provider: 'ollama',
      });
      setThinking(false);
    }, 600);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#090C10] text-[#F8FAFC] overflow-hidden font-sans select-none border border-[#1E2638]">
      {/* 1. Header (Frameless Window Title Bar + Brand Logo) */}
      <Header />

      {/* 2. Iron Man HUD Status Bar */}
      <StatusHud />

      {/* 3. Main Activity View Surface */}
      <main className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
        {viewMode === 'mission-control' ? (
          <DailyBriefing
            data={mockBriefingData}
            onSelectPrompt={handleSelectPrompt}
          />
        ) : (
          <ConversationCanvas
            messages={messages}
            isThinking={isThinking}
            presenceState={presenceState}
          />
        )}
      </main>

      {/* 4. Command Bar */}
      <CommandBar />
    </div>
  );
};
