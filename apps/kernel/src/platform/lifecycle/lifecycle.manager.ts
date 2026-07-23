import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import type { ILifecycleParticipant } from './lifecycle.interface';
import { LifecycleRegistry } from './lifecycle.registry';
import { LifecycleState } from './lifecycle.types';
import { LoggerManager } from '../logging/logger.manager';

@Injectable()
export class LifecycleManager
  implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown
{
  private state: LifecycleState = LifecycleState.CREATED;

  constructor(
    private readonly registry: LifecycleRegistry,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('LifecycleManager');
  }

  getState(): LifecycleState {
    return this.state;
  }

  registerParticipant(participant: ILifecycleParticipant): void {
    this.registry.register(participant);
    this.logger.debug(`Registered lifecycle participant '${participant.name}'`);
  }

  async initialize(): Promise<void> {
    if (this.state !== LifecycleState.CREATED) {
      return;
    }

    this.state = LifecycleState.INITIALIZING;
    this.logger.info('Initializing lifecycle participants...');

    try {
      for (const participant of this.registry.getAll()) {
        if (participant.initialize) {
          await participant.initialize();
          this.logger.debug(`Initialized participant '${participant.name}'`);
        }
      }
      this.state = LifecycleState.READY;
      this.logger.info('Lifecycle state transition: READY');
    } catch (error) {
      this.state = LifecycleState.FAILED;
      this.logger.error('Lifecycle initialization failed', error);
      throw error;
    }
  }

  async start(): Promise<void> {
    if (this.state !== LifecycleState.READY && this.state !== LifecycleState.INITIALIZING) {
      return;
    }

    try {
      for (const participant of this.registry.getAll()) {
        if (participant.start) {
          await participant.start();
          this.logger.debug(`Started participant '${participant.name}'`);
        }
      }
      this.state = LifecycleState.RUNNING;
      this.logger.info('Lifecycle state transition: RUNNING');
    } catch (error) {
      this.state = LifecycleState.FAILED;
      this.logger.error('Lifecycle start failed', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (
      this.state === LifecycleState.STOPPING ||
      this.state === LifecycleState.STOPPED
    ) {
      return;
    }

    this.state = LifecycleState.STOPPING;
    this.logger.info('Stopping lifecycle participants...');

    try {
      const participants = this.registry.getAll().reverse();
      for (const participant of participants) {
        if (participant.stop) {
          await participant.stop();
          this.logger.debug(`Stopped participant '${participant.name}'`);
        }
      }
      this.state = LifecycleState.STOPPED;
      this.logger.info('Lifecycle state transition: STOPPED');
    } catch (error) {
      this.state = LifecycleState.FAILED;
      this.logger.error('Lifecycle stop failed', error);
      throw error;
    }
  }

  async onModuleInit(): Promise<void> {
    await this.initialize();
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.start();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.stop();
  }
}
