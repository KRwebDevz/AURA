import { Global, Module } from '@nestjs/common';
import { IntentService } from './intent/intent.service';
import { KernelContextProvider } from './context/providers/kernel.context-provider';
import { ContextBuilder } from './context/context.builder';
import { PromptManager } from './prompt/prompt.manager';
import { ResponseValidator } from './validator/response.validator';

@Global()
@Module({
  providers: [
    IntentService,
    KernelContextProvider,
    ContextBuilder,
    PromptManager,
    ResponseValidator,
  ],
  exports: [
    IntentService,
    KernelContextProvider,
    ContextBuilder,
    PromptManager,
    ResponseValidator,
  ],
})
export class IntelligenceModule {}
