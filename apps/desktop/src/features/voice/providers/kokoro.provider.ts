import { ITTSProvider, TTSOptions } from './tts.provider';

export class KokoroProvider implements ITTSProvider {
  readonly name = 'kokoro';
  private readonly baseUrl: string;
  private readonly defaultVoice: string;
  private activeAudio: HTMLAudioElement | null = null;
  private activeObjectUrl: string | null = null;

  constructor(
    baseUrl = 'http://localhost:8880',
    defaultVoice = 'af_bella',
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultVoice = defaultVoice;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/audio/voices`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async speak(text: string, options?: TTSOptions): Promise<void> {
    this.stop();

    const selectedVoice = options?.voice || this.defaultVoice;
    const speed = options?.rate || 1.0;
    const volume = options?.volume ?? 1.0;

    const url = `${this.baseUrl}/v1/audio/speech`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        model: 'kokoro',
        input: text,
        voice: selectedVoice,
        speed,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      throw new Error(`Kokoro TTS failed with status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const objectUrl = URL.createObjectURL(blob);
    this.activeObjectUrl = objectUrl;

    return new Promise((resolve) => {
      const audio = new Audio(objectUrl);
      audio.volume = volume;
      this.activeAudio = audio;

      const cleanup = () => {
        if (this.activeObjectUrl === objectUrl) {
          URL.revokeObjectURL(objectUrl);
          this.activeObjectUrl = null;
        }
        if (this.activeAudio === audio) {
          this.activeAudio = null;
        }
      };

      audio.onended = () => {
        cleanup();
        resolve();
      };

      audio.onerror = () => {
        cleanup();
        resolve();
      };

      audio.play().catch(() => {
        cleanup();
        resolve();
      });
    });
  }

  stop(): void {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
    if (this.activeObjectUrl) {
      URL.revokeObjectURL(this.activeObjectUrl);
      this.activeObjectUrl = null;
    }
  }
}
