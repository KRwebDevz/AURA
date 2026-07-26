import { TTSProviderHealth, TTSRequest, TTSResponse } from '../voice.types';

export const TTS_PROVIDER_TOKEN = Symbol('TTS_PROVIDER_TOKEN');

export interface ITTSProvider {
  readonly name: string;
  synthesize(request: TTSRequest): Promise<TTSResponse>;
  health(): Promise<TTSProviderHealth>;
}
