import { DomainContext, IntentCapability } from '../intent/intent.types';

export interface IntelligenceContext {
  capability: IntentCapability;
  domain: DomainContext;
  kernelState: string;
  providerName: string;
  providerStatus: 'healthy' | 'unhealthy';
  activeModel: string;
  uptimeSeconds: number;
  timestamp: string;
  extraData?: Record<string, Record<string, unknown>>;
}
