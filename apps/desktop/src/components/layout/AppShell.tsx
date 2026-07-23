import React from 'react';
import { Header } from './Header';
import { StatusHud } from './StatusHud';
import { CommandBar } from '../command/CommandBar';
import { DailyBriefing } from '../mission-control/DailyBriefing';
import { ConversationCanvas } from '../conversation/ConversationCanvas';
import { useAuraStore } from '../../store/useAuraStore';
import { mockBriefingData } from '../../services/mockApi';
import { useConversation } from '../../features/conversation/hooks/useConversation';

export const AppShell: React.FC = () => {
  const { viewMode, messages, isThinking, presenceState } = useAuraStore();
  const { sendMessage } = useConversation();

  const handleSelectPrompt = (prompt: string) => {
    sendMessage(prompt);
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
