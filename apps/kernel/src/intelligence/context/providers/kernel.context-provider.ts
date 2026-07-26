import { Injectable } from '@nestjs/common';
import { IContextProvider } from '../context.provider.interface';
import { LifecycleManager } from '../../../platform/lifecycle/lifecycle.manager';
import { AIManager } from '../../../platform/ai/ai.manager';
import { ConfigurationService } from '../../../config/configuration.service';
import { LoggerManager } from '../../../platform/logging/logger.manager';

@Injectable()
export class KernelContextProvider implements IContextProvider {
  readonly name = 'kernel';
  private readonly startTime = Date.now();

  constructor(
    private readonly lifecycleManager: LifecycleManager,
    private readonly aiManager: AIManager,
    private readonly configService: ConfigurationService,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('KernelContextProvider');
  }

  async getContextData(): Promise<Record<string, unknown>> {
    const kernelState = this.lifecycleManager.getState();
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);

    let providerStatus: 'healthy' | 'unhealthy' = 'unhealthy';
    let providerName = 'ollama';
    try {
      const health = await this.aiManager.health();
      providerStatus = health.status;
      providerName = health.provider || 'ollama';
    } catch (error) {
      this.logger.warn('Failed to fetch AI provider health in KernelContextProvider', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    const activeModel = this.configService.ollamaDefaultModel;

    return {
      kernelState,
      providerName,
      providerStatus,
      activeModel,
      uptimeSeconds,
      timestamp: new Date().toISOString(),
    };
  }
}
