import type { IAIProvider } from './ai.interface';
import type { AIChatRequest } from './ai.types';

export interface IModelRouter {
  route(request: AIChatRequest): Promise<IAIProvider>;
  registerProvider(provider: IAIProvider): void;
}
