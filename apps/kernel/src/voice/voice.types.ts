export interface TTSRequest {
  text: string;
  voice?: string;
  speed?: number;
}

export interface TTSResponse {
  audio: Buffer;
  format: 'wav' | 'mp3';
  durationMs?: number;
}

export interface TTSProviderHealth {
  status: 'healthy' | 'unhealthy';
  provider: string;
  details?: Record<string, unknown>;
}

export interface TTSProviderOptions {
  baseUrl: string;
  defaultVoice?: string;
}
