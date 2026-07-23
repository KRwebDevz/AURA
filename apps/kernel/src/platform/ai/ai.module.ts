import { Global, Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIManager } from './ai.manager';
import { AI_PROVIDER_TOKEN, aiProvider } from './ai.provider';

@Global()
@Module({
  controllers: [AIController],
  providers: [aiProvider, AIManager],
  exports: [AI_PROVIDER_TOKEN, AIManager],
})
export class AIModule {}
