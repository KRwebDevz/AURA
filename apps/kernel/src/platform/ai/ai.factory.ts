import { IAIProvider } from './ai.interface';
import { AIProviderOptions } from './ai.types';
import { OllamaProvider } from './providers/ollama.provider';

export class AIFactory {
  static createProvider(
    providerName: string,
    options: AIProviderOptions,
  ): IAIProvider {
    switch (providerName.toLowerCase()) {
      case 'ollama':
      default:
        return new OllamaProvider(options);
    }
  }
}
