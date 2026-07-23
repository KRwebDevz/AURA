import { Inject, Injectable } from '@nestjs/common';
import type { IAIProvider } from './ai.interface';
import { AI_PROVIDER_TOKEN } from './ai.provider';
import {
  AIGenerateRequest,
  AIGenerateResponse,
  AIModel,
  AIProviderHealth,
} from './ai.types';
import { LoggerManager } from '../logging/logger.manager';

@Injectable()
export class AIManager {
  constructor(
    @Inject(AI_PROVIDER_TOKEN) private readonly provider: IAIProvider,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('AIManager');
  }

  async generate(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    this.logger.debug(
      `Generating response using provider '${this.provider.name}'`,
      {
        model: request.model,
        promptLength: request.prompt.length,
      },
    );
    return this.provider.generate(request);
  }

  stream(request: AIGenerateRequest): AsyncIterable<string> {
    this.logger.debug(
      `Streaming response using provider '${this.provider.name}'`,
      {
        model: request.model,
        promptLength: request.prompt.length,
      },
    );
    return this.provider.stream(request);
  }

  async health(): Promise<AIProviderHealth> {
    this.logger.debug(
      `Checking health of AI provider '${this.provider.name}'`,
    );
    return this.provider.health();
  }

  async getModels(): Promise<AIModel[]> {
    this.logger.debug(
      `Fetching models from AI provider '${this.provider.name}'`,
    );
    return this.provider.getModels();
  }
}
