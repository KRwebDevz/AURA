import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/configuration.module';
import { LoggingModule } from './platform/logging/logging.module';
import { KernelModule } from './kernel/kernel.module';

@Module({
  imports: [ConfigurationModule, LoggingModule, KernelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
