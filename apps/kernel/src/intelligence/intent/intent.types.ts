export type IntentCapability =
  | 'QUESTION'
  | 'COMMAND'
  | 'SEARCH'
  | 'PLAN'
  | 'ANALYZE'
  | 'CREATE';

export type DomainContext =
  | 'TRADING'
  | 'DEVELOPMENT'
  | 'ARCHITECTURE'
  | 'BUSINESS'
  | 'PERSONAL';

export interface IntentAnalysisResult {
  capability: IntentCapability;
  domain: DomainContext;
  confidence: number;
  matchedKeywords: string[];
}
