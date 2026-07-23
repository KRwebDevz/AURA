import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AIManager } from './ai.manager';
import type {
  AIChatRequest,
  AIChatResponse,
  AIGenerateRequest,
  AIGenerateResponse,
  AIModel,
  AIProviderHealth,
} from './ai.types';

@Controller('ai')
export class AIController {
  constructor(private readonly aiManager: AIManager) {}

  @Get('health')
  async getHealth(): Promise<AIProviderHealth> {
    return this.aiManager.health();
  }

  @Get('models')
  async getModels(): Promise<AIModel[]> {
    return this.aiManager.getModels();
  }

  @Post('chat')
  async chat(
    @Body() body: AIChatRequest,
    @Req() req: { requestId?: string },
  ): Promise<AIChatResponse> {
    if (!body || (!body.prompt && (!body.messages || body.messages.length === 0))) {
      throw new Error("Missing required 'prompt' or 'messages' field in request body.");
    }
    const response = await this.aiManager.chat(body);
    return {
      ...response,
      requestId: req?.requestId,
    };
  }

  @Post('generate')
  async generate(
    @Body() body: AIGenerateRequest,
    @Req() req: { requestId?: string },
  ): Promise<AIGenerateResponse> {
    if (!body || !body.prompt) {
      throw new Error("Missing required 'prompt' field in request body.");
    }
    const response = await this.aiManager.generate(body);
    return {
      ...response,
      requestId: req?.requestId,
    };
  }
}
