import { Inject, Injectable } from '@nestjs/common';
import type { ITTSProvider } from './providers/tts.provider';
import { TTS_PROVIDER_TOKEN } from './providers/tts.provider';
import { TTSProviderHealth, TTSRequest, TTSResponse } from './voice.types';
import { LoggerManager } from '../platform/logging/logger.manager';

@Injectable()
export class VoiceManager {
  constructor(
    @Inject(TTS_PROVIDER_TOKEN) private readonly ttsProvider: ITTSProvider,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('VoiceManager');
  }

  async synthesize(request: TTSRequest): Promise<TTSResponse> {
    this.logger.debug(
      `Synthesizing speech using TTS provider '${this.ttsProvider.name}'`,
      {
        textLength: request.text ? request.text.length : 0,
        voice: request.voice,
      },
    );
    return this.ttsProvider.synthesize(request);
  }

  async health(): Promise<TTSProviderHealth> {
    this.logger.debug(
      `Checking health of TTS provider '${this.ttsProvider.name}'`,
    );
    return this.ttsProvider.health();
  }
}
