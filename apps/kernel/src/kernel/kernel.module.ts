import { Module } from '@nestjs/common';
import { KernelController } from './kernel.controller';
import { KernelService } from './kernel.service';

@Module({
  controllers: [KernelController],
  providers: [KernelService],
  exports: [KernelService],
})
export class KernelModule {}
