import { Global, Module } from '@nestjs/common';
import { ConfigurationService } from '../config/configuration.service';
import { KokoroProvider } from './providers/kokoro.provider';
import { TTS_PROVIDER_TOKEN } from './providers/tts.provider';
import { VoiceController } from './voice.controller';
import { VoiceManager } from './voice.manager';

@Global()
@Module({
  controllers: [VoiceController],
  providers: [
    {
      provide: TTS_PROVIDER_TOKEN,
      useFactory: (configService: ConfigurationService) => {
        return new KokoroProvider({
          baseUrl: configService.kokoroBaseUrl,
          defaultVoice: configService.kokoroDefaultVoice,
        });
      },
      inject: [ConfigurationService],
    },
    VoiceManager,
  ],
  exports: [VoiceManager],
})
export class VoiceModule {}
