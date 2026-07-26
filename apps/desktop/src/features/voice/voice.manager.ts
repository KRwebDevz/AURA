import { ITTSProvider } from './providers/tts.provider';
import { KokoroProvider } from './providers/kokoro.provider';
import { WebSpeechProvider } from './providers/webspeech.provider';
import { useAuraStore } from '../../store/useAuraStore';

export type VoiceStatusPosture = 'READY' | 'SPEAKING' | 'MUTED' | 'OFFLINE';

export class DesktopVoiceManager {
  private static kokoroProvider = new KokoroProvider();
  private static webSpeechProvider = new WebSpeechProvider();
  private static currentPosture: VoiceStatusPosture = 'READY';

  static getVoiceStatus(): VoiceStatusPosture {
    const { isMuted, isSpeaking } = useAuraStore.getState();
    if (isMuted) return 'MUTED';
    if (isSpeaking) return 'SPEAKING';
    return this.currentPosture;
  }

  static async speak(text: string): Promise<void> {
    const { isMuted, voiceSettings, setSpeaking } = useAuraStore.getState();

    // 1. Immediately stop any currently playing speech (Interrupt safety)
    this.stop();

    if (isMuted || !text.trim() || !voiceSettings.autoPlay) {
      return;
    }

    let selectedProvider: ITTSProvider | null = null;
    const isKokoroOnline = await this.kokoroProvider.isAvailable();

    if (voiceSettings.providerMode === 'kokoro-only') {
      if (isKokoroOnline) {
        selectedProvider = this.kokoroProvider;
      } else {
        this.currentPosture = 'OFFLINE';
        return;
      }
    } else if (voiceSettings.providerMode === 'webspeech-only') {
      selectedProvider = this.webSpeechProvider;
    } else {
      // Auto mode
      if (isKokoroOnline) {
        selectedProvider = this.kokoroProvider;
      } else if (voiceSettings.autoFallback) {
        selectedProvider = this.webSpeechProvider;
      } else {
        this.currentPosture = 'OFFLINE';
        return;
      }
    }

    this.currentPosture = 'SPEAKING';

    try {
      setSpeaking(true);
      await selectedProvider.speak(text, {
        voice: voiceSettings.selectedVoice,
        rate: voiceSettings.speechRate,
        pitch: voiceSettings.pitch,
        volume: voiceSettings.volume,
      });
    } catch {
      if (
        selectedProvider !== this.webSpeechProvider &&
        voiceSettings.autoFallback &&
        voiceSettings.providerMode === 'auto'
      ) {
        await this.webSpeechProvider.speak(text, {
          voice: voiceSettings.selectedVoice,
          rate: voiceSettings.speechRate,
          pitch: voiceSettings.pitch,
          volume: voiceSettings.volume,
        });
      } else {
        this.currentPosture = 'OFFLINE';
      }
    } finally {
      setSpeaking(false);
      this.currentPosture = 'READY';
    }
  }

  static stop(): void {
    this.kokoroProvider.stop();
    this.webSpeechProvider.stop();
    useAuraStore.getState().setSpeaking(false);
  }
}
