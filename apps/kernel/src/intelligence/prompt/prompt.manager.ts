import { Injectable } from '@nestjs/common';
import { PromptRequest } from './prompt.request';
import { formatGroundedSystemPrompt } from './prompt.templates';
import { PersonaManager } from '../../platform/persona/persona.manager';
import { LoggerManager } from '../../platform/logging/logger.manager';

@Injectable()
export class PromptManager {
  constructor(
    private readonly personaManager: PersonaManager,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('PromptManager');
  }

  generateSystemPrompt(request: PromptRequest): string {
    const basePersonaPrompt = this.personaManager.getSystemPrompt(
      request.personaId,
    );
    const finalPrompt = formatGroundedSystemPrompt(basePersonaPrompt, request);

    this.logger.debug(
      `Generated grounded system prompt [Capability: ${request.capability}] [Domain: ${request.domain}]`,
      {
        promptLength: finalPrompt.length,
      },
    );

    return finalPrompt;
  }
}
