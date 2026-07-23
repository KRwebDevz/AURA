import { ConversationApi } from '../../../services/api/conversation.api';
import { ConversationMessage } from '../../../types';

export class ConversationFeatureService {
  static async sendUserMessage(
    userText: string,
  ): Promise<ConversationMessage> {
    try {
      const response = await ConversationApi.sendMessage(userText);

      return {
        id: response.id || `aura-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        createdAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
        model: response.model || 'llama3.2',
        provider: response.provider || 'ollama',
      };
    } catch (error) {
      // PERSONA-001 Compliant Error Formatting
      return {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'Sir, I am unable to establish a connection with the AURA Kernel service at this time. All core local systems remain standing by.',
        createdAt: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'error',
        model: 'kernel-offline',
        provider: 'aura-kernel',
      };
    }
  }
}
