import { Provider } from '@nestjs/common';
import { ConfigurationService } from '../../config/configuration.service';
import { AIFactory } from './ai.factory';

export const AI_PROVIDER_TOKEN = 'IAIProvider';

export const aiProvider: Provider = {
  provide: AI_PROVIDER_TOKEN,
  useFactory: (configService: ConfigurationService) => {
    return AIFactory.createProvider('ollama', {
      baseUrl: configService.ollamaBaseUrl,
      defaultModel: configService.ollamaDefaultModel,
    });
  },
  inject: [ConfigurationService],
};
