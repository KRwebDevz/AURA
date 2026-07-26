import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AIManager } from '../platform/ai/ai.manager';
import { LoggerManager } from '../platform/logging/logger.manager';
import { IntentService } from '../intelligence/intent/intent.service';
import { ContextBuilder } from '../intelligence/context/context.builder';
import { PromptManager } from '../intelligence/prompt/prompt.manager';
import { ResponseValidator } from '../intelligence/validator/response.validator';
import { ConversationMapper } from './conversation.mapper';
import {
  ConversationResponse,
  CreateConversationRequest,
} from './conversation.types';

@Injectable()
export class ConversationService {
  constructor(
    private readonly intentService: IntentService,
    private readonly contextBuilder: ContextBuilder,
    private readonly promptManager: PromptManager,
    private readonly aiManager: AIManager,
    private readonly responseValidator: ResponseValidator,
    private readonly mapper: ConversationMapper,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('ConversationService');
  }

  async processMessage(
    request: CreateConversationRequest,
  ): Promise<ConversationResponse> {
    const conversationId = randomUUID();

    this.logger.debug(`Executing intelligence pipeline for conversation '${conversationId}'`, {
      conversationId,
      messageLength: request.message ? request.message.length : 0,
    });

    // 1. Intent Analysis
    const intentResult = this.intentService.analyzeIntent(request.message);

    // 2. Context Building
    const context = await this.contextBuilder.buildContext(intentResult.intent);

    // 3. Prompt Management
    const systemPrompt = this.promptManager.generateSystemPrompt(context);

    // 4. AI Provider Invocation
    const aiResponse = await this.aiManager.chat({
      system: systemPrompt,
      prompt: request.message,
      model: request.model,
    });

    // 5. Response Validation
    const validationResult = this.responseValidator.validateResponse(
      aiResponse.response,
    );

    const finalAiResponse = {
      ...aiResponse,
      response: validationResult.sanitizedResponse,
    };

    return this.mapper.toConversationResponse(
      conversationId,
      finalAiResponse,
      'ollama',
    );
  }
}
