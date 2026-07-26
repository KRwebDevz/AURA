import { Injectable } from '@nestjs/common';
import { IntentAnalysisResult, IntentType } from './intent.types';
import { LoggerManager } from '../../platform/logging/logger.manager';

@Injectable()
export class IntentService {
  constructor(private readonly logger: LoggerManager) {
    this.logger.setContext('IntentService');
  }

  analyzeIntent(userPrompt: string): IntentAnalysisResult {
    const text = userPrompt.toLowerCase().trim();

    // 1. SYSTEM_STATUS
    const statusKeywords = [
      'status',
      'health',
      'operational',
      'readiness',
      'running',
      'uptime',
      'system check',
      'kernel',
    ];
    const statusMatches = statusKeywords.filter((kw) => text.includes(kw));
    if (statusMatches.length > 0) {
      this.logger.debug('Classified intent as SYSTEM_STATUS', {
        matches: statusMatches,
      });
      return {
        intent: 'SYSTEM_STATUS',
        confidence: 0.9,
        matchedKeywords: statusMatches,
      };
    }

    // 2. PLANNING
    const planningKeywords = [
      'plan',
      'schedule',
      'agenda',
      'task',
      'priority',
      'todo',
      'calendar',
      'meeting',
    ];
    const planningMatches = planningKeywords.filter((kw) => text.includes(kw));
    if (planningMatches.length > 0) {
      this.logger.debug('Classified intent as PLANNING', {
        matches: planningMatches,
      });
      return {
        intent: 'PLANNING',
        confidence: 0.85,
        matchedKeywords: planningMatches,
      };
    }

    // 3. DEVELOPMENT
    const devKeywords = [
      'code',
      'architecture',
      'build',
      'debug',
      'git',
      'monorepo',
      'typescript',
      'nest',
      'vite',
    ];
    const devMatches = devKeywords.filter((kw) => text.includes(kw));
    if (devMatches.length > 0) {
      this.logger.debug('Classified intent as DEVELOPMENT', {
        matches: devMatches,
      });
      return {
        intent: 'DEVELOPMENT',
        confidence: 0.85,
        matchedKeywords: devMatches,
      };
    }

    // 4. MEMORY
    const memoryKeywords = [
      'remember',
      'memory',
      'recall',
      'history',
      'note',
      'earlier',
    ];
    const memoryMatches = memoryKeywords.filter((kw) => text.includes(kw));
    if (memoryMatches.length > 0) {
      this.logger.debug('Classified intent as MEMORY', {
        matches: memoryMatches,
      });
      return {
        intent: 'MEMORY',
        confidence: 0.8,
        matchedKeywords: memoryMatches,
      };
    }

    // Default: GENERAL_CHAT
    this.logger.debug('Classified intent as GENERAL_CHAT');
    return {
      intent: 'GENERAL_CHAT',
      confidence: 0.7,
      matchedKeywords: [],
    };
  }
}
