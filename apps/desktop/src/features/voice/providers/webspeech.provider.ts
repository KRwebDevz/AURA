import { ITTSProvider } from './tts.provider';

export class WebSpeechProvider implements ITTSProvider {
  readonly name = 'webspeech';

  async isAvailable(): Promise<boolean> {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  async speak(text: string): Promise<void> {
    if (!('speechSynthesis' in window)) return;

    this.stop();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Calm executive cadence
      utterance.pitch = 1.0;

      // Select best natural English voice available in OS
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Guy') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha')),
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
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
