import { Injectable } from '@nestjs/common';
import { LoggerManager } from '../../platform/logging/logger.manager';

export interface PreValidationResult {
  isValid: boolean;
  canBypassLlm: boolean;
  fallbackResponse?: string;
  reason?: string;
}

export interface PostValidationResult {
  isValid: boolean;
  sanitizedResponse: string;
  reason?: string;
}

@Injectable()
export class ResponseValidator {
  constructor(private readonly logger: LoggerManager) {
    this.logger.setContext('ResponseValidator');
  }

  validatePreGeneration(userMessage: string): PreValidationResult {
    const trimmed = (userMessage || '').trim();

    if (!trimmed) {
      this.logger.warn('Pre-validation failed: User prompt is empty');
      return {
        isValid: false,
        canBypassLlm: true,
        fallbackResponse:
          'Sir, please provide a command or prompt for me to execute.',
        reason: 'User prompt is empty.',
      };
    }

    return {
      isValid: true,
      canBypassLlm: false,
    };
  }

  validatePostGeneration(rawResponse: string): PostValidationResult {
    const trimmed = (rawResponse || '').trim();

    // 1. Reject Empty Responses
    if (!trimmed) {
      this.logger.warn('Post-validation rejected empty AI response');
      return {
        isValid: false,
        sanitizedResponse:
          'Sir, all system status signals are nominal and ready for your command.',
        reason: 'Response was empty.',
      };
    }

    // 2. Detect obvious hallucinations about unavailable external modules
    const hallucinationTriggers = [
      'connected to your gmail',
      'accessed your google calendar',
      'synced your whatsapp messages',
      'sent the email to',
      'opened autocad on your desktop',
    ];

    const foundHallucinations = hallucinationTriggers.filter((trigger) =>
      trimmed.toLowerCase().includes(trigger),
    );

    if (foundHallucinations.length > 0) {
      this.logger.warn('Post-validation detected hallucinated module claim in AI response', {
        triggers: foundHallucinations,
      });
      return {
        isValid: true,
        sanitizedResponse: `${trimmed}\n\n[Note: External service integration modules remain standing by.]`,
        reason: `Hallucinated claims detected: ${foundHallucinations.join(', ')}`,
      };
    }

    return {
      isValid: true,
      sanitizedResponse: trimmed,
    };
  }
}
