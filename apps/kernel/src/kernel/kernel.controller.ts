import { Controller, Get } from '@nestjs/common';
import { KernelService, type HealthResponse } from './kernel.service';
import { LoggerManager } from '../platform/logging/logger.manager';

@Controller()
export class KernelController {
  constructor(
    private readonly kernelService: KernelService,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('KernelController');
  }

  @Get('health')
  getHealth(): HealthResponse {
    this.logger.debug('Health endpoint invoked');
    return this.kernelService.getHealth();
  }
}
