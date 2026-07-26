import { create } from 'zustand';
import {
  AssistantState,
  ConversationMessage,
  ViewMode,
  WorkspaceDomain,
} from '../types';

const initialMessages: ConversationMessage[] = [
  {
    id: 'init-1',
    role: 'assistant',
    content:
      'Good morning, Sir. Current system check: All core modules operational. Your 10:00 AM Capgemini briefing notes and Sutr quotation files are staged for your review.',
    createdAt: '09:15 AM',
    status: 'sent',
    isStreaming: false,
    model: 'llama3.2',
    provider: 'ollama',
  },
];

interface AuraState {
  viewMode: ViewMode;
  activeDomain: WorkspaceDomain;
  messages: ConversationMessage[];
  assistantState: AssistantState;
  isThinking: boolean;
  presenceState: string;
  isMuted: boolean;
  isSpeaking: boolean;
  setViewMode: (mode: ViewMode) => void;
  setActiveDomain: (domain: WorkspaceDomain) => void;
  setAssistantState: (state: AssistantState, presence?: string) => void;
  toggleMute: () => void;
  setSpeaking: (isSpeaking: boolean) => void;
  addMessage: (message: ConversationMessage) => void;
  appendChunkToMessage: (id: string, chunk: string, isDone?: boolean) => void;
  updateMessageStatus: (
    id: string,
    status: 'sending' | 'sent' | 'error',
  ) => void;
  setThinking: (isThinking: boolean, state?: string) => void;
  resetConversation: () => void;
}

export const useAuraStore = create<AuraState>((set) => ({
  viewMode: 'mission-control',
  activeDomain: 'trading',
  messages: initialMessages,
  assistantState: 'COMPLETE',
  isThinking: false,
  presenceState: 'AURA is ready',
  isMuted: false,
  isSpeaking: false,
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveDomain: (domain) => set({ activeDomain: domain }),
  setAssistantState: (assistantState, presenceState) =>
    set({
      assistantState,
      isThinking: assistantState === 'THINKING' || assistantState === 'STREAMING',
      presenceState:
        presenceState ||
        (assistantState === 'THINKING'
          ? 'AURA is thinking...'
          : assistantState === 'STREAMING'
            ? 'AURA is streaming response...'
            : 'AURA is ready'),
    }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  appendChunkToMessage: (id, chunk, isDone = false) =>
    set((state) => ({
      messages: state.messages.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            content: m.content + chunk,
            isStreaming: !isDone,
            status: isDone ? 'sent' : 'sending',
          };
        }
        return m;
      }),
    })),
  updateMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, status } : m,
      ),
    })),
  setThinking: (isThinking, presenceState = 'AURA is analyzing...') =>
    set({
      isThinking,
      presenceState,
      assistantState: isThinking ? 'THINKING' : 'COMPLETE',
    }),
  resetConversation: () => set({ messages: initialMessages }),
}));
