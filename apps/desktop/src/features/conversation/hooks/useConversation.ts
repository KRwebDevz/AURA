import { useCallback, useRef } from 'react';
import { useAuraStore } from '../../../store/useAuraStore';
import { ConversationFeatureService } from '../services/conversation.service';
import { DesktopVoiceManager } from '../../voice/voice.manager';
import { ConversationMessage } from '../../../types';

export function useConversation() {
  const {
    setViewMode,
    addMessage,
    appendChunkToMessage,
    markMessageComplete,
    setAssistantState,
    assistantState,
    isThinking,
    voiceSettings,
  } = useAuraStore();

  const fullAssistantTextRef = useRef('');
  const activeAbortControllerRef = useRef<AbortController | null>(null);

  const cancelGeneration = useCallback(() => {
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
      activeAbortControllerRef.current = null;
    }
    // Instantly stop audio, clear speech queue & sentence processor
    DesktopVoiceManager.stop();
    setAssistantState('COMPLETE', 'AURA is ready');
  }, [setAssistantState]);

  const sendMessage = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed || isThinking || assistantState === 'STREAMING') return;

      // Automatically switch to Conversation Focus Mode
      setViewMode('conversation-focus');

      // Abort any lingering request & stop previous voice output
      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }
      DesktopVoiceManager.stop();

      const abortController = new AbortController();
      activeAbortControllerRef.current = abortController;

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

            // Feed token chunk to live voice stream if enabled
            if (voiceSettings.streamingVoice) {
              DesktopVoiceManager.streamToken(payload.chunk);
            }
          }

          if (payload.done) {
            markMessageComplete(auraMsgId);
            setAssistantState('COMPLETE', 'AURA is ready');

            if (voiceSettings.streamingVoice) {
              DesktopVoiceManager.endStream();
            } else {
              DesktopVoiceManager.speak(fullAssistantTextRef.current);
            }
          }
        },
        () => {
          if (!fullAssistantTextRef.current) {
            setAssistantState('ERROR', 'AURA system check required');
            const errorMsg =
              'Sir, I am unable to establish a connection with the AURA Kernel service at this time. All core local systems remain standing by.';
            appendChunkToMessage(auraMsgId, errorMsg, true);
            if (!voiceSettings.streamingVoice) {
              DesktopVoiceManager.speak(errorMsg);
            }
          } else {
            // Partial response received - keep text, flush voice queue & mark complete
            markMessageComplete(auraMsgId);
            setAssistantState('COMPLETE', 'AURA is ready');
            if (voiceSettings.streamingVoice) {
              DesktopVoiceManager.endStream();
            }
          }
        },
        () => {
          markMessageComplete(auraMsgId);
          setAssistantState('COMPLETE', 'AURA is ready');
          if (voiceSettings.streamingVoice) {
            DesktopVoiceManager.endStream();
          }
        },
        abortController.signal,
      );
    },
    [
      addMessage,
      appendChunkToMessage,
      assistantState,
      isThinking,
      markMessageComplete,
      setAssistantState,
      setViewMode,
      voiceSettings.streamingVoice,
    ],
  );

  return {
    sendMessage,
    cancelGeneration,
    isThinking,
    assistantState,
  };
}
