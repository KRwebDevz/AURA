import { useCallback, useRef } from 'react';
import { useAuraStore } from '../../../store/useAuraStore';
import { ConversationFeatureService } from '../services/conversation.service';
import { VoiceApi } from '../../../services/api/voice.api';
import { AudioPlayerService } from '../../voice/services/audio.player';
import { ConversationMessage } from '../../../types';

export function useConversation() {
  const {
    setViewMode,
    addMessage,
    appendChunkToMessage,
    setAssistantState,
    assistantState,
    isThinking,
    isMuted,
    setSpeaking,
  } = useAuraStore();

  const fullAssistantTextRef = useRef('');

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
      fullAssistantTextRef.current = '';

      let isFirstChunk = true;

      const triggerVoiceSynthesis = async (text: string) => {
        const state = useAuraStore.getState();
        if (state.isMuted || !text.trim()) return;

        try {
          const audioBuffer = await VoiceApi.synthesize(text);
          await AudioPlayerService.playWavBuffer(
            audioBuffer,
            () => setSpeaking(true),
            () => setSpeaking(false),
          );
        } catch {
          setSpeaking(false);
        }
      };

      ConversationFeatureService.streamUserMessage(
        trimmed,
        (payload) => {
          if (isFirstChunk && payload.chunk) {
            isFirstChunk = false;
            setAssistantState('STREAMING', 'AURA is streaming response...');
          }

          if (payload.chunk) {
            fullAssistantTextRef.current += payload.chunk;
            appendChunkToMessage(auraMsgId, payload.chunk, payload.done);
          }

          if (payload.done) {
            appendChunkToMessage(auraMsgId, '', true);
            setAssistantState('COMPLETE', 'AURA is ready');
            triggerVoiceSynthesis(fullAssistantTextRef.current);
          }
        },
        () => {
          setAssistantState('ERROR', 'AURA system check required');
          const errorMsg =
            'Sir, I am unable to establish a connection with the AURA Kernel service at this time. All core local systems remain standing by.';
          appendChunkToMessage(auraMsgId, errorMsg, true);
          triggerVoiceSynthesis(errorMsg);
        },
        () => {
          setAssistantState('COMPLETE', 'AURA is ready');
        },
      );
    },
    [
      addMessage,
      appendChunkToMessage,
      isMuted,
      isThinking,
      setAssistantState,
      setSpeaking,
      setViewMode,
    ],
  );

  return {
    sendMessage,
    isThinking,
    assistantState,
  };
}
