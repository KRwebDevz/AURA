import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/configuration.module';
import { KernelModule } from './kernel/kernel.module';

@Module({
  imports: [ConfigurationModule, KernelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
