import { create } from 'zustand';
import { ConversationMessage, ViewMode, WorkspaceDomain } from '../types';

const initialMessages: ConversationMessage[] = [
  {
    id: 'init-1',
    role: 'assistant',
    content:
      'Good morning, Sir. Current system check: All core modules operational. Your 10:00 AM Capgemini briefing notes and Sutr quotation files are staged for your review.',
    createdAt: '09:15 AM',
    status: 'sent',
    model: 'llama3.2',
    provider: 'ollama',
  },
];

interface AuraState {
  viewMode: ViewMode;
  activeDomain: WorkspaceDomain;
  messages: ConversationMessage[];
  isThinking: boolean;
  presenceState: string;
  setViewMode: (mode: ViewMode) => void;
  setActiveDomain: (domain: WorkspaceDomain) => void;
  addMessage: (message: ConversationMessage) => void;
  updateMessageStatus: (id: string, status: 'sending' | 'sent' | 'error') => void;
  setThinking: (isThinking: boolean, state?: string) => void;
  resetConversation: () => void;
}

export const useAuraStore = create<AuraState>((set) => ({
  viewMode: 'mission-control',
  activeDomain: 'trading',
  messages: initialMessages,
  isThinking: false,
  presenceState: 'AURA is ready',
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveDomain: (domain) => set({ activeDomain: domain }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, status } : m,
      ),
    })),
  setThinking: (isThinking, presenceState = 'AURA is analyzing...') =>
    set({ isThinking, presenceState }),
  resetConversation: () => set({ messages: initialMessages }),
}));
