import { Body, Controller, Get, Post } from '@nestjs/common';
import { AIManager } from './ai.manager';
import type { AIGenerateRequest, AIGenerateResponse, AIModel, AIProviderHealth } from './ai.types';

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

  @Post('generate')
  async generate(@Body() body: AIGenerateRequest): Promise<AIGenerateResponse> {
    if (!body || !body.prompt) {
      throw new Error("Missing required 'prompt' field in request body.");
    }
    return this.aiManager.generate(body);
  }
}
