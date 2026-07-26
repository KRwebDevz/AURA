import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AIManager } from '../platform/ai/ai.manager';
import { LoggerManager } from '../platform/logging/logger.manager';
import { IntentService } from '../intelligence/intent/intent.service';
import { ContextBuilder } from '../intelligence/context/context.builder';
import { PromptManager } from '../intelligence/prompt/prompt.manager';
import { PromptRequest } from '../intelligence/prompt/prompt.request';
import { ResponseValidator } from '../intelligence/validator/response.validator';
import { ConversationMapper } from './conversation.mapper';
import {
  ConversationResponse,
  CreateConversationRequest,
} from './conversation.types';

export interface StreamChunkPayload {
  id: string;
  chunk: string;
  done: boolean;
  model?: string;
  provider?: string;
}

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

    this.logger.debug(
      `Executing intelligence pipeline for conversation '${conversationId}'`,
      {
        conversationId,
        messageLength: request.message ? request.message.length : 0,
      },
    );

    // 1. Pre-Generation Validation
    const preValidation = this.responseValidator.validatePreGeneration(
      request.message,
    );
    if (preValidation.canBypassLlm && preValidation.fallbackResponse) {
      return this.mapper.toConversationResponse(
        conversationId,
        {
          response: preValidation.fallbackResponse,
          model: request.model || 'system',
          done: true,
        },
        'system',
      );
    }

    // 2. Capability & Domain Intent Analysis
    const intentResult = this.intentService.analyzeIntent(request.message);

    // 3. Context Provider Aggregation
    const context = await this.contextBuilder.buildContext(
      intentResult.capability,
      intentResult.domain,
    );

    // 4. PromptRequest Payload Assembly
    const promptRequest: PromptRequest = {
      capability: intentResult.capability,
      domain: intentResult.domain,
      context,
      userMessage: request.message,
    };

    const systemPrompt =
      this.promptManager.generateSystemPrompt(promptRequest);

    // 5. AI Provider Execution
    const aiResponse = await this.aiManager.chat({
      system: systemPrompt,
      prompt: request.message,
      model: request.model,
    });

    // 6. Post-Generation Validation
    const postValidation = this.responseValidator.validatePostGeneration(
      aiResponse.response,
    );

    const finalAiResponse = {
      ...aiResponse,
      response: postValidation.sanitizedResponse,
    };

    return this.mapper.toConversationResponse(
      conversationId,
      finalAiResponse,
      'ollama',
    );
  }

  async *streamMessage(
    request: CreateConversationRequest,
  ): AsyncIterable<StreamChunkPayload> {
    const conversationId = randomUUID();

    this.logger.debug(
      `Executing intelligence streaming pipeline for conversation '${conversationId}'`,
      { conversationId },
    );

    // 1. Pre-Generation Validation
    const preValidation = this.responseValidator.validatePreGeneration(
      request.message,
    );
    if (preValidation.canBypassLlm && preValidation.fallbackResponse) {
      yield {
        id: conversationId,
        chunk: preValidation.fallbackResponse,
        done: true,
        model: 'system',
        provider: 'system',
      };
      return;
    }

    // 2. Capability & Domain Intent Analysis
    const intentResult = this.intentService.analyzeIntent(request.message);

    // 3. Context Provider Aggregation
    const context = await this.contextBuilder.buildContext(
      intentResult.capability,
      intentResult.domain,
    );

    // 4. PromptRequest Payload Assembly
    const promptRequest: PromptRequest = {
      capability: intentResult.capability,
      domain: intentResult.domain,
      context,
      userMessage: request.message,
    };

    const systemPrompt =
      this.promptManager.generateSystemPrompt(promptRequest);

    // 5. Stream from AI Provider
    const tokenStream = this.aiManager.stream({
      system: systemPrompt,
      prompt: request.message,
      model: request.model,
    });

    for await (const token of tokenStream) {
      yield {
        id: conversationId,
        chunk: token,
        done: false,
        model: request.model || 'llama3.2',
        provider: 'ollama',
      };
    }

    yield {
      id: conversationId,
      chunk: '',
      done: true,
      model: request.model || 'llama3.2',
      provider: 'ollama',
    };
  }
}
