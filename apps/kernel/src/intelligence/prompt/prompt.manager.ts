import { Injectable } from '@nestjs/common';
import { IntelligenceContext } from '../context/context.types';
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

  generateSystemPrompt(
    context: IntelligenceContext,
    personaId?: string,
  ): string {
    const basePersonaPrompt = this.personaManager.getSystemPrompt(personaId);
    const finalPrompt = formatGroundedSystemPrompt(basePersonaPrompt, context);

    this.logger.debug(
      `Generated grounded system prompt for intent '${context.intent}'`,
      {
        promptLength: finalPrompt.length,
      },
    );

    return finalPrompt;
  }
}
