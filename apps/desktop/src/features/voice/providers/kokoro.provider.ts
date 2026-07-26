import { ITTSProvider } from './tts.provider';

export class KokoroProvider implements ITTSProvider {
  readonly name = 'kokoro';
  private readonly baseUrl: string;
  private readonly defaultVoice: string;
  private activeAudio: HTMLAudioElement | null = null;

  constructor(
    baseUrl = 'http://localhost:8880',
    defaultVoice = 'af_bella',
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultVoice = defaultVoice;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/models`, {
        method: 'GET',
        signal: AbortSignal.timeout(1000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async speak(text: string, voice?: string): Promise<void> {
    this.stop();

    const selectedVoice = voice || this.defaultVoice;
    const url = `${this.baseUrl}/v1/audio/speech`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'kokoro',
        input: text,
        voice: selectedVoice,
        speed: 1.0,
        response_format: 'wav',
      }),
    });

    if (!response.ok) {
      throw new Error(`Kokoro TTS failed with status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    const objectUrl = URL.createObjectURL(blob);

    return new Promise((resolve) => {
      const audio = new Audio(objectUrl);
      this.activeAudio = audio;

      audio.onended = () => {
        URL.revokeObjectURL(objectUrl);
        this.activeAudio = null;
        resolve();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        this.activeAudio = null;
        resolve();
      };

      audio.play().catch(() => resolve());
    });
  }

  stop(): void {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio = null;
    }
  }
}
