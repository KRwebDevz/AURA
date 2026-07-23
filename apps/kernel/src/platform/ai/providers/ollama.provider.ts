import { IAIProvider } from '../ai.interface';
import {
  AIGenerateRequest,
  AIGenerateResponse,
  AIModel,
  AIProviderHealth,
  AIProviderOptions,
} from '../ai.types';

export class OllamaProvider implements IAIProvider {
  readonly name = 'ollama';
  private readonly baseUrl: string;
  private readonly defaultModel: string;

  constructor(options: AIProviderOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.defaultModel = options.defaultModel;
  }

  async generate(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    const model = request.model || this.defaultModel;
    const url = `${this.baseUrl}/api/generate`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: request.prompt,
          system: request.system,
          options: request.options,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Ollama generate failed with HTTP status ${response.status}: ${response.statusText}`,
        );
      }

      const data = (await response.json()) as {
        response: string;
        model: string;
        done: boolean;
        total_duration?: number;
      };

      return {
        response: data.response || '',
        model: data.model || model,
        done: data.done ?? true,
        totalDurationMs: data.total_duration
          ? Math.round(data.total_duration / 1_000_000)
          : undefined,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`[OllamaProvider] Generate error: ${msg}`);
    }
  }

  async *stream(request: AIGenerateRequest): AsyncIterable<string> {
    const model = request.model || this.defaultModel;
    const url = `${this.baseUrl}/api/generate`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: request.prompt,
        system: request.system,
        options: request.options,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(
        `Ollama stream failed with HTTP status ${response.status}`,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.trim() !== '');

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line) as { response?: string };
          if (parsed.response) {
            yield parsed.response;
          }
        } catch {
          // ignore non-JSON line chunks
        }
      }
    }
  }

  async health(): Promise<AIProviderHealth> {
    try {
      const models = await this.getModels();
      return {
        status: 'healthy',
        provider: this.name,
        modelCount: models.length,
        details: {
          baseUrl: this.baseUrl,
          defaultModel: this.defaultModel,
          availableModels: models.map((m) => m.name),
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        provider: this.name,
        modelCount: 0,
        details: {
          baseUrl: this.baseUrl,
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  async getModels(): Promise<AIModel[]> {
    const url = `${this.baseUrl}/api/tags`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Ollama tags request failed with HTTP ${response.status}`,
        );
      }

      const data = (await response.json()) as {
        models?: Array<{ name: string; size?: number; modified_at?: string }>;
      };

      return (data.models || []).map((m) => ({
        name: m.name,
        size: m.size,
        modifiedAt: m.modified_at,
      }));
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`[OllamaProvider] Unable to list models: ${msg}`);
    }
  }
}
