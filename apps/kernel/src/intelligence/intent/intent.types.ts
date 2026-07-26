export type IntentType =
  | 'SYSTEM_STATUS'
  | 'GENERAL_CHAT'
  | 'PLANNING'
  | 'MEMORY'
  | 'DEVELOPMENT';

export interface IntentAnalysisResult {
  intent: IntentType;
  confidence: number;
  matchedKeywords: string[];
}
