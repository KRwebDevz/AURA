export interface AIGenerateRequest {
  prompt: string;
  model?: string;
  system?: string;
  options?: Record<string, unknown>;
}

export interface AIGenerateResponse {
  response: string;
  model: string;
  done: boolean;
  totalDurationMs?: number;
}

export interface AIModel {
  name: string;
  size?: number;
  modifiedAt?: string;
}

export interface AIProviderHealth {
  status: 'healthy' | 'unhealthy';
  provider: string;
  modelCount: number;
  details?: Record<string, unknown>;
}

export interface AIProviderOptions {
  baseUrl: string;
  defaultModel: string;
}
