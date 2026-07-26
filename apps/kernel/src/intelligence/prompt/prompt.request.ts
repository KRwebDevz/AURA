import { DomainContext, IntentCapability } from '../intent/intent.types';
import { IntelligenceContext } from '../context/context.types';

export interface PromptRequest {
  personaId?: string;
  capability: IntentCapability;
  domain: DomainContext;
  context: IntelligenceContext;
  userMessage: string;
  memoryContext?: string;
  workspaceContext?: string;
  rules?: string[];
}
