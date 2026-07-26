import { Global, Module } from '@nestjs/common';
import { IntentService } from './intent/intent.service';
import { ContextBuilder } from './context/context.builder';
import { PromptManager } from './prompt/prompt.manager';
import { ResponseValidator } from './validator/response.validator';

@Global()
@Module({
  providers: [
    IntentService,
    ContextBuilder,
    PromptManager,
    ResponseValidator,
  ],
  exports: [
    IntentService,
    ContextBuilder,
    PromptManager,
    ResponseValidator,
  ],
})
export class IntelligenceModule {}
