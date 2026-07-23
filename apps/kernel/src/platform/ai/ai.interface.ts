import {
  AIGenerateRequest,
  AIGenerateResponse,
  AIModel,
  AIProviderHealth,
} from './ai.types';

export interface IAIProvider {
  readonly name: string;
  generate(request: AIGenerateRequest): Promise<AIGenerateResponse>;
  stream(request: AIGenerateRequest): AsyncIterable<string>;
  health(): Promise<AIProviderHealth>;
  getModels(): Promise<AIModel[]>;
}
