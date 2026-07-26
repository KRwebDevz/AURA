import { ITTSProvider, TTSOptions } from './tts.provider';

export class WebSpeechProvider implements ITTSProvider {
  readonly name = 'webspeech';

  async isAvailable(): Promise<boolean> {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  async speak(text: string, options?: TTSOptions): Promise<void> {
    if (!('speechSynthesis' in window)) return;

    this.stop();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate ?? 1.0;
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      // Select best natural English voice available in OS
      const voices = window.speechSynthesis.getVoices();
      let matchedVoice: SpeechSynthesisVoice | undefined;

      if (options?.voice) {
        matchedVoice = voices.find((v) =>
          v.name.toLowerCase().includes(options.voice!.toLowerCase()),
        );
      }

      if (!matchedVoice) {
        matchedVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Guy') ||
                v.name.includes('Google') ||
                v.name.includes('Samantha')),
          ) || voices.find((v) => v.lang.startsWith('en'));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
