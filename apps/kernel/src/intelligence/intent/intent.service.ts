import { Injectable } from '@nestjs/common';
import { DomainContext, IntentAnalysisResult, IntentCapability } from './intent.types';
import { LoggerManager } from '../../platform/logging/logger.manager';

@Injectable()
export class IntentService {
  constructor(private readonly logger: LoggerManager) {
    this.logger.setContext('IntentService');
  }

  analyzeIntent(userPrompt: string): IntentAnalysisResult {
    const text = userPrompt.toLowerCase().trim();
    const matchedKeywords: string[] = [];

    // 1. Determine Domain
    let domain: DomainContext = 'PERSONAL';

    if (
      text.includes('trade') ||
      text.includes('trading') ||
      text.includes('nifty') ||
      text.includes('gold') ||
      text.includes('market')
    ) {
      domain = 'TRADING';
      matchedKeywords.push('trading');
    } else if (
      text.includes('code') ||
      text.includes('nest') ||
      text.includes('vite') ||
      text.includes('typescript') ||
      text.includes('git') ||
      text.includes('bug') ||
      text.includes('build')
    ) {
      domain = 'DEVELOPMENT';
      matchedKeywords.push('development');
    } else if (
      text.includes('architecture') ||
      text.includes('capgemini') ||
      text.includes('design') ||
      text.includes('schema') ||
      text.includes('diagram')
    ) {
      domain = 'ARCHITECTURE';
      matchedKeywords.push('architecture');
    } else if (
      text.includes('sutr') ||
      text.includes('quotation') ||
      text.includes('drawing') ||
      text.includes('client') ||
      text.includes('business')
    ) {
      domain = 'BUSINESS';
      matchedKeywords.push('business');
    }

    // 2. Determine Capability
    let capability: IntentCapability = 'QUESTION';

    if (
      text.includes('review') ||
      text.includes('analyze') ||
      text.includes('eval') ||
      text.includes('compare') ||
      text.includes('report')
    ) {
      capability = 'ANALYZE';
      matchedKeywords.push('analyze');
    } else if (
      text.includes('plan') ||
      text.includes('schedule') ||
      text.includes('agenda') ||
      text.includes('prioritize')
    ) {
      capability = 'PLAN';
      matchedKeywords.push('plan');
    } else if (
      text.includes('find') ||
      text.includes('search') ||
      text.includes('lookup') ||
      text.includes('where')
    ) {
      capability = 'SEARCH';
      matchedKeywords.push('search');
    } else if (
      text.includes('create') ||
      text.includes('generate') ||
      text.includes('draft') ||
      text.includes('write')
    ) {
      capability = 'CREATE';
      matchedKeywords.push('create');
    } else if (
      text.includes('run') ||
      text.includes('execute') ||
      text.includes('start') ||
      text.includes('stop') ||
      text.includes('status') ||
      text.includes('health')
    ) {
      capability = 'COMMAND';
      matchedKeywords.push('command');
    }

    this.logger.debug('Classified capability and domain intent', {
      capability,
      domain,
      matchedKeywords,
    });

    return {
      capability,
      domain,
      confidence: 0.85,
      matchedKeywords,
    };
  }
}
