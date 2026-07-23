import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/configuration.module';
import { LoggingModule } from './platform/logging/logging.module';
import { LifecycleModule } from './platform/lifecycle/lifecycle.module';
import { AIModule } from './platform/ai/ai.module';
import { PersonaModule } from './platform/persona/persona.module';
import { ConversationModule } from './conversation/conversation.module';
import { KernelModule } from './kernel/kernel.module';

@Module({
  imports: [
    ConfigurationModule,
    LoggingModule,
    LifecycleModule,
    AIModule,
    PersonaModule,
    ConversationModule,
    KernelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
