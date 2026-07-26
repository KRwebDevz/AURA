import { Injectable } from '@nestjs/common';
import { IntelligenceContext } from './context.types';
import { IntentType } from '../intent/intent.types';
import { LifecycleManager } from '../../platform/lifecycle/lifecycle.manager';
import { AIManager } from '../../platform/ai/ai.manager';
import { ConfigurationService } from '../../config/configuration.service';
import { LoggerManager } from '../../platform/logging/logger.manager';

@Injectable()
export class ContextBuilder {
  private readonly startTime = Date.now();

  constructor(
    private readonly lifecycleManager: LifecycleManager,
    private readonly aiManager: AIManager,
    private readonly configService: ConfigurationService,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('ContextBuilder');
  }

  async buildContext(intent: IntentType): Promise<IntelligenceContext> {
    const kernelState = this.lifecycleManager.getState();
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);

    let providerStatus: 'healthy' | 'unhealthy' = 'unhealthy';
    let providerName = 'ollama';
    try {
      const health = await this.aiManager.health();
      providerStatus = health.status;
      providerName = health.provider || 'ollama';
    } catch (error) {
      this.logger.warn('Failed to fetch AI provider health', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    const activeModel = this.configService.ollamaDefaultModel;

    const context: IntelligenceContext = {
      kernelState,
      providerName,
      providerStatus,
      activeModel,
      uptimeSeconds,
      timestamp: new Date().toISOString(),
      intent,
    };

    this.logger.debug('Built intelligence runtime context', { context });
    return context;
  }
}
