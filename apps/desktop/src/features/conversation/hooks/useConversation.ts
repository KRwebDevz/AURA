import { useCallback } from 'react';
import { useAuraStore } from '../../../store/useAuraStore';
import { ConversationFeatureService } from '../services/conversation.service';
import { ConversationMessage } from '../../../types';

export function useConversation() {
  const { setViewMode, addMessage, setThinking, isThinking } = useAuraStore();

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

      // Set thinking presence state
      setThinking(true, 'AURA is thinking...');

      try {
        const auraResponse = await ConversationFeatureService.sendUserMessage(
          trimmed,
        );
        addMessage(auraResponse);
      } finally {
        setThinking(false);
      }
    },
    [addMessage, isThinking, setThinking, setViewMode],
  );

  return {
    sendMessage,
    isThinking,
  };
}
