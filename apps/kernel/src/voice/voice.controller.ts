import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { VoiceManager } from './voice.manager';
import { TTSProviderHealth } from './voice.types';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceManager: VoiceManager) {}

  @Post('synthesize')
  async synthesize(
    @Body() body: { text: string; voice?: string; speed?: number },
    @Res() res: Response,
  ): Promise<void> {
    if (!body || !body.text) {
      res.status(400).json({ error: "Missing required 'text' field." });
      return;
    }

    const ttsResponse = await this.voiceManager.synthesize({
      text: body.text,
      voice: body.voice,
      speed: body.speed,
    });

    res.setHeader('Content-Type', `audio/${ttsResponse.format}`);
    res.setHeader('Content-Length', ttsResponse.audio.length);
    res.send(ttsResponse.audio);
  }

  @Get('health')
  async health(): Promise<TTSProviderHealth> {
    return this.voiceManager.health();
  }
}
