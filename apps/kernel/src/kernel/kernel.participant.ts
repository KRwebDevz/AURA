import { Injectable } from '@nestjs/common';
import type { ILifecycleParticipant } from '../platform/lifecycle/lifecycle.interface';
import { LoggerManager } from '../platform/logging/logger.manager';

@Injectable()
export class KernelParticipant implements ILifecycleParticipant {
  readonly name = 'kernel';

  constructor(private readonly logger: LoggerManager) {
    this.logger.setContext('KernelParticipant');
  }

  initialize(): void {
    this.logger.debug('Kernel participant initialized');
  }

  start(): void {
    this.logger.debug('Kernel participant started');
  }

  stop(): void {
    this.logger.debug('Kernel participant stopped');
  }

  health(): Record<string, unknown> {
    return { status: 'healthy' };
  }
}
