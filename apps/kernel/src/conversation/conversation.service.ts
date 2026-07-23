import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AIManager } from '../platform/ai/ai.manager';
import { LoggerManager } from '../platform/logging/logger.manager';
import { ConversationMapper } from './conversation.mapper';
import {
  ConversationResponse,
  CreateConversationRequest,
} from './conversation.types';
import { AURA_PERSONA_001 } from './prompts/persona-001';

@Injectable()
export class ConversationService {
  constructor(
    private readonly aiManager: AIManager,
    private readonly mapper: ConversationMapper,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('ConversationService');
  }

  async processMessage(
    request: CreateConversationRequest,
  ): Promise<ConversationResponse> {
    const conversationId = randomUUID();

    this.logger.debug(`Processing message for conversation '${conversationId}'`, {
      conversationId,
      messageLength: request.message ? request.message.length : 0,
    });

    const aiResponse = await this.aiManager.chat({
      system: AURA_PERSONA_001,
      prompt: request.message,
      model: request.model,
    });

    return this.mapper.toConversationResponse(
      conversationId,
      aiResponse,
      'ollama',
    );
  }
}
