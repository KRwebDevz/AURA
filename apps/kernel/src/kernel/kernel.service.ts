import { Injectable } from '@nestjs/common';
import { ConfigurationService } from '../config/configuration.service';
import { LifecycleManager } from '../platform/lifecycle/lifecycle.manager';
import { LifecycleState } from '../platform/lifecycle/lifecycle.types';

export interface HealthResponse {
  name: string;
  version: string;
  environment: string;
  status: string;
  uptime: number;
  timestamp: string;
  kernel: {
    state: LifecycleState;
  };
}

@Injectable()
export class KernelService {
  private readonly startTime: number = Date.now();

  constructor(
    private readonly configService: ConfigurationService,
    private readonly lifecycleManager: LifecycleManager,
  ) {}

  getHealth(): HealthResponse {
    const uptimeInSeconds = (Date.now() - this.startTime) / 1000;
    return {
      name: this.configService.name,
      version: this.configService.version,
      environment: this.configService.environment,
      status: 'healthy',
      uptime: parseFloat(uptimeInSeconds.toFixed(2)),
      timestamp: new Date().toISOString(),
      kernel: {
        state: this.lifecycleManager.getState(),
      },
    };
  }
}
