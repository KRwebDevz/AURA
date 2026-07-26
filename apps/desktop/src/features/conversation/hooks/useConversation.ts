import { useCallback } from 'react';
import { useAuraStore } from '../../../store/useAuraStore';
import { ConversationFeatureService } from '../services/conversation.service';
import { ConversationMessage } from '../../../types';

export function useConversation() {
  const {
    setViewMode,
    addMessage,
    appendChunkToMessage,
    setAssistantState,
    assistantState,
    isThinking,
  } = useAuraStore();

  const sendMessage = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed || isThinking) return;

      // Automatically switch to Conversation Focus Mode
      setViewMode('conversation-focus');

      const userMsgId = `user-${Date.now()}`;
      const userMessage: ConversationMessage = {
        id: userMsgId,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
      };

      // Add user message to store
      addMessage(userMessage);

      // Transition AssistantState to THINKING
      setAssistantState('THINKING', 'AURA is thinking...');

      const auraMsgId = `aura-${Date.now()}`;
      const placeholderAssistantMsg: ConversationMessage = {
        id: auraMsgId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sending',
        isStreaming: true,
        model: 'llama3.2',
        provider: 'ollama',
      };

      addMessage(placeholderAssistantMsg);

      let isFirstChunk = true;

      ConversationFeatureService.streamUserMessage(
        trimmed,
        (payload) => {
          if (isFirstChunk && payload.chunk) {
            isFirstChunk = false;
            setAssistantState('STREAMING', 'AURA is streaming response...');
          }

          if (payload.chunk) {
            appendChunkToMessage(auraMsgId, payload.chunk, payload.done);
          }

          if (payload.done) {
            appendChunkToMessage(auraMsgId, '', true);
            setAssistantState('COMPLETE', 'AURA is ready');
          }
        },
        () => {
          setAssistantState('ERROR', 'AURA system check required');
          appendChunkToMessage(
            auraMsgId,
            'Sir, I am unable to establish a connection with the AURA Kernel service at this time. All core local systems remain standing by.',
            true,
          );
        },
        () => {
          setAssistantState('COMPLETE', 'AURA is ready');
        },
      );
    },
    [addMessage, appendChunkToMessage, isThinking, setAssistantState, setViewMode],
  );

  return {
    sendMessage,
    isThinking,
    assistantState,
  };
}
