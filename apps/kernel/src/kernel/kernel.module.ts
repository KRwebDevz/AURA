import { Module, OnModuleInit } from '@nestjs/common';
import { KernelController } from './kernel.controller';
import { KernelParticipant } from './kernel.participant';
import { KernelService } from './kernel.service';
import { LifecycleManager } from '../platform/lifecycle/lifecycle.manager';

@Module({
  controllers: [KernelController],
  providers: [KernelService, KernelParticipant],
  exports: [KernelService, KernelParticipant],
})
export class KernelModule implements OnModuleInit {
  constructor(
    private readonly lifecycleManager: LifecycleManager,
    private readonly kernelParticipant: KernelParticipant,
  ) {}

  onModuleInit(): void {
    this.lifecycleManager.registerParticipant(this.kernelParticipant);
  }
}
