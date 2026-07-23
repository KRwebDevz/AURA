import { create } from 'zustand';
import { ConversationMessage, ViewMode, WorkspaceDomain } from '../types';
import { mockInitialMessages } from '../services/mockApi';

interface AuraState {
  viewMode: ViewMode;
  activeDomain: WorkspaceDomain;
  messages: ConversationMessage[];
  isThinking: boolean;
  presenceState: string;
  setViewMode: (mode: ViewMode) => void;
  setActiveDomain: (domain: WorkspaceDomain) => void;
  addMessage: (message: ConversationMessage) => void;
  setThinking: (isThinking: boolean, state?: string) => void;
  resetConversation: () => void;
}

export const useAuraStore = create<AuraState>((set) => ({
  viewMode: 'mission-control',
  activeDomain: 'trading',
  messages: mockInitialMessages,
  isThinking: false,
  presenceState: 'AURA is ready',
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveDomain: (domain) => set({ activeDomain: domain }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setThinking: (isThinking, presenceState = 'AURA is analyzing...') =>
    set({ isThinking, presenceState }),
  resetConversation: () => set({ messages: mockInitialMessages }),
}));
