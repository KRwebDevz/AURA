import { ITTSProvider } from './providers/tts.provider';
import { KokoroProvider } from './providers/kokoro.provider';
import { WebSpeechProvider } from './providers/webspeech.provider';
import { useAuraStore } from '../../store/useAuraStore';

export class DesktopVoiceManager {
  private static kokoroProvider = new KokoroProvider();
  private static webSpeechProvider = new WebSpeechProvider();
  private static currentProviderName = 'STANDBY';

  static getCurrentProviderName(): string {
    return this.currentProviderName;
  }

  static async speak(text: string): Promise<void> {
    const { isMuted, setSpeaking } = useAuraStore.getState();
    if (isMuted || !text.trim()) return;

    let selectedProvider: ITTSProvider = this.webSpeechProvider;

    // Check if local Kokoro engine is online
    if (await this.kokoroProvider.isAvailable()) {
      selectedProvider = this.kokoroProvider;
    }

    this.currentProviderName = selectedProvider.name.toUpperCase();

    try {
      setSpeaking(true);
      await selectedProvider.speak(text);
    } catch {
      // Fallback to WebSpeech if Kokoro synthesis fails
      if (selectedProvider !== this.webSpeechProvider) {
        this.currentProviderName = 'WEBSPEECH';
        await this.webSpeechProvider.speak(text);
      }
    } finally {
      setSpeaking(false);
    }
  }

  static stop(): void {
    this.kokoroProvider.stop();
    this.webSpeechProvider.stop();
    useAuraStore.getState().setSpeaking(false);
  }
}
