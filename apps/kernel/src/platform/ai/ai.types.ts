export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatRequest {
  messages?: ChatMessage[];
  prompt?: string;
  model?: string;
  system?: string;
  options?: Record<string, unknown>;
}

export interface AIChatResponse {
  response: string;
  model: string;
  done: boolean;
  requestId?: string;
  totalDurationMs?: number;
}

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
  requestId?: string;
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
