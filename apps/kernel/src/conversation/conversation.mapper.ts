import { Injectable } from '@nestjs/common';
import type { AIChatResponse } from '../platform/ai/ai.types';
import { ConversationResponse } from './conversation.types';

@Injectable()
export class ConversationMapper {
  toConversationResponse(
    conversationId: string,
    aiResponse: AIChatResponse,
    providerName: string = 'ollama',
  ): ConversationResponse {
    return {
      id: conversationId,
      message: aiResponse.response,
      provider: providerName,
      model: aiResponse.model,
    };
  }
}
