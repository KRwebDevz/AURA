import { IntentType } from '../intent/intent.types';

export interface IntelligenceContext {
  kernelState: string;
  providerName: string;
  providerStatus: 'healthy' | 'unhealthy';
  activeModel: string;
  uptimeSeconds: number;
  timestamp: string;
  intent: IntentType;
}
