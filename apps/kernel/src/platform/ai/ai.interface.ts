import {
  AIChatRequest,
  AIChatResponse,
  AIGenerateRequest,
  AIGenerateResponse,
  AIModel,
  AIProviderHealth,
} from './ai.types';

export interface IAIProvider {
  readonly name: string;
  chat(request: AIChatRequest): Promise<AIChatResponse>;
  generate(request: AIGenerateRequest): Promise<AIGenerateResponse>;
  stream(request: AIChatRequest | AIGenerateRequest): AsyncIterable<string>;
  health(): Promise<AIProviderHealth>;
  getModels(): Promise<AIModel[]>;
}
