import { Injectable } from '@nestjs/common';
import { IntelligenceContext } from './context.types';
import { DomainContext, IntentCapability } from '../intent/intent.types';
import { IContextProvider } from './context.provider.interface';
import { KernelContextProvider } from './providers/kernel.context-provider';
import { LoggerManager } from '../../platform/logging/logger.manager';

@Injectable()
export class ContextBuilder {
  private readonly providers: IContextProvider[] = [];

  constructor(
    private readonly kernelContextProvider: KernelContextProvider,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('ContextBuilder');
    this.registerProvider(this.kernelContextProvider);
  }

  registerProvider(provider: IContextProvider): void {
    this.providers.push(provider);
    this.logger.debug(`Registered context provider '${provider.name}'`);
  }

  async buildContext(
    capability: IntentCapability,
    domain: DomainContext,
  ): Promise<IntelligenceContext> {
    const aggregated: Record<string, Record<string, unknown>> = {};

    for (const provider of this.providers) {
      try {
        aggregated[provider.name] = await provider.getContextData();
      } catch (error) {
        this.logger.warn(`Failed to gather context from provider '${provider.name}'`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const kernelData = aggregated['kernel'] || {};

    const context: IntelligenceContext = {
      capability,
      domain,
      kernelState: (kernelData.kernelState as string) || 'RUNNING',
      providerName: (kernelData.providerName as string) || 'ollama',
      providerStatus:
        (kernelData.providerStatus as 'healthy' | 'unhealthy') || 'healthy',
      activeModel: (kernelData.activeModel as string) || 'llama3.2',
      uptimeSeconds: (kernelData.uptimeSeconds as number) || 0,
      timestamp: (kernelData.timestamp as string) || new Date().toISOString(),
      extraData: aggregated,
    };

    this.logger.debug('Aggregated context across providers', { context });
    return context;
  }
}
