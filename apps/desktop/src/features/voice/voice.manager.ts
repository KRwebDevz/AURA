import { ITTSProvider } from './providers/tts.provider';
import { KokoroProvider } from './providers/kokoro.provider';
import { WebSpeechProvider } from './providers/webspeech.provider';
import { KokoroService } from './services/kokoro.service';
import { SentenceStreamProcessor } from './services/sentence.processor';
import { SpeechQueue } from './services/speech.queue';
import { useAuraStore } from '../../store/useAuraStore';

const HEALTH_POLL_INTERVAL_MS = 10_000;

export class DesktopVoiceManager {
  private static kokoroProvider = new KokoroProvider();
  private static webSpeechProvider = new WebSpeechProvider();
  private static healthPollTimer: ReturnType<typeof setInterval> | null = null;

  private static speechQueue = new SpeechQueue();
  private static sentenceProcessor = new SentenceStreamProcessor((sentence) => {
    DesktopVoiceManager.speechQueue.enqueue(sentence, (s) =>
      DesktopVoiceManager.speakSentence(s),
    );
  });

  /**
   * Initialize the voice subsystem on app startup.
   * - Checks Kokoro health
   * - Fetches available voices into Zustand
   * - Starts the 10-second health polling loop
   */
  static async initialize(): Promise<void> {
    await this.refreshHealthAndVoices();
    this.startHealthPolling();
  }

  /**
   * Tear down the voice subsystem. Stops health polling and any active speech.
   */
  static destroy(): void {
    this.stopHealthPolling();
    this.stop();
  }

  /**
   * Returns the current voice status posture from the Zustand store.
   */
  static getVoiceStatus() {
    const { isMuted, isSpeaking, voiceStatus } = useAuraStore.getState();
    if (isMuted) return 'MUTED';
    if (isSpeaking) return 'SPEAKING';
    return voiceStatus;
  }

  /**
   * Processes a real-time streaming token from the LLM.
   * Feeds the sentence processor and enqueues completed sentences into SpeechQueue.
   */
  static streamToken(token: string): void {
    const { isMuted, voiceSettings } = useAuraStore.getState();

    if (isMuted || !voiceSettings.autoPlay || !voiceSettings.streamingVoice) {
      return;
    }

    this.sentenceProcessor.processChunk(token);
  }

  /**
   * Signals the end of the streaming response.
   * Flushes any remaining sentence in the processor buffer to the SpeechQueue.
   */
  static endStream(): void {
    const { isMuted, voiceSettings } = useAuraStore.getState();

    if (isMuted || !voiceSettings.autoPlay || !voiceSettings.streamingVoice) {
      return;
    }

    this.sentenceProcessor.flush();
  }

  /**
   * Speak full text in a single execution block (used for Play Sample or when streamingVoice is disabled).
   * Interrupts any active stream or queued speech first.
   */
  static async speak(text: string): Promise<void> {
    const { isMuted, voiceSettings } = useAuraStore.getState();

    // Interrupt active playback and queue first
    this.stop();

    if (isMuted || !text.trim() || !voiceSettings.autoPlay) {
      return;
    }

    await this.speakSentence(text);
  }

  /**
   * Internal sentence speaker called by SpeechQueue.
   * Routes the sentence to Kokoro or WebSpeech and handles posture/state transitions.
   */

  private static async speakSentence(sentence: string): Promise<void> {
    const { isMuted, voiceSettings, setSpeaking, setVoiceStatus } =
      useAuraStore.getState();

    if (isMuted || !sentence.trim()) return;

    let selectedProvider: ITTSProvider | null = null;
    const isKokoroOnline = await this.kokoroProvider.isAvailable();

    if (voiceSettings.providerMode === 'kokoro-only') {
      if (isKokoroOnline) {
        selectedProvider = this.kokoroProvider;
      } else {
        setVoiceStatus('OFFLINE');
        return;
      }
    } else if (voiceSettings.providerMode === 'webspeech-only') {
      selectedProvider = this.webSpeechProvider;
    } else {
      // Auto mode: Kokoro first, WebSpeech fallback if enabled
      if (isKokoroOnline) {
        selectedProvider = this.kokoroProvider;
      } else if (voiceSettings.autoFallback) {
        selectedProvider = this.webSpeechProvider;
      } else {
        setVoiceStatus('OFFLINE');
        return;
      }
    }

    try {
      setSpeaking(true);
      setVoiceStatus('SPEAKING');

      await selectedProvider.speak(sentence, {
        voice: voiceSettings.selectedVoice,
        rate: voiceSettings.speechRate,
        pitch: voiceSettings.pitch,
        volume: voiceSettings.volume,
      });
    } catch {
      // If Kokoro fails mid-sentence, try WebSpeech fallback in auto mode
      if (
        selectedProvider !== this.webSpeechProvider &&
        voiceSettings.autoFallback &&
        voiceSettings.providerMode === 'auto'
      ) {
        try {
          await this.webSpeechProvider.speak(sentence, {
            voice: voiceSettings.selectedVoice,
            rate: voiceSettings.speechRate,
            pitch: voiceSettings.pitch,
            volume: voiceSettings.volume,
          });
        } catch {
          setVoiceStatus('OFFLINE');
        }
      } else {
        setVoiceStatus('OFFLINE');
      }
    } finally {
      // Only reset posture if no more items are queued
      if (this.speechQueue.size() === 0) {
        setSpeaking(false);
        const stillOnline = await KokoroService.checkHealth();
        const { isMuted: currentMuted } = useAuraStore.getState();
        if (currentMuted) {
          setVoiceStatus('MUTED');
        } else {
          setVoiceStatus(stillOnline ? 'READY' : 'OFFLINE');
        }
      }
    }
  }

  /**
   * Stops all active speech output and clears the speech queue & sentence processor immediately.
   */
  static stop(): void {
    this.sentenceProcessor.reset();
    this.speechQueue.clear();
    this.kokoroProvider.stop();
    this.webSpeechProvider.stop();
    useAuraStore.getState().setSpeaking(false);
  }

  // ─── Private Helpers ────────────────────────────────────────

  /**
   * Checks Kokoro health and fetches voices, updating the store accordingly.
   */
  private static async refreshHealthAndVoices(): Promise<void> {
    const { setVoiceStatus, setAvailableVoices, isMuted } =
      useAuraStore.getState();

    const isOnline = await KokoroService.checkHealth();

    if (isOnline) {
      const voices = await KokoroService.fetchVoices(true);
      setAvailableVoices(voices);
      setVoiceStatus(isMuted ? 'MUTED' : 'READY');
    } else {
      setVoiceStatus(isMuted ? 'MUTED' : 'OFFLINE');
    }
  }

  /**
   * Starts the 10-second recurring health poll.
   */
  private static startHealthPolling(): void {
    this.stopHealthPolling();

    this.healthPollTimer = setInterval(async () => {
      const { voiceStatus, isMuted, isSpeaking, setVoiceStatus, setAvailableVoices } =
        useAuraStore.getState();

      // Don't interfere while actively speaking or processing speech queue
      if (isSpeaking || this.speechQueue.isProcessing()) return;

      const isOnline = await KokoroService.checkHealth();

      if (isOnline) {
        if (voiceStatus === 'OFFLINE') {
          const voices = await KokoroService.fetchVoices(true);
          setAvailableVoices(voices);
        }
        setVoiceStatus(isMuted ? 'MUTED' : 'READY');
      } else {
        setVoiceStatus(isMuted ? 'MUTED' : 'OFFLINE');
      }
    }, HEALTH_POLL_INTERVAL_MS);
  }

  /**
   * Stops the recurring health poll.
   */
  private static stopHealthPolling(): void {
    if (this.healthPollTimer) {
      clearInterval(this.healthPollTimer);
      this.healthPollTimer = null;
    }
  }
}
