export class AudioPlayerService {
  private static activeAudio: HTMLAudioElement | null = null;

  static async playWavBuffer(
    arrayBuffer: ArrayBuffer,
    onStart?: () => void,
    onEnded?: () => void,
  ): Promise<void> {
    try {
      if (this.activeAudio) {
        this.activeAudio.pause();
        this.activeAudio = null;
      }

      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      this.activeAudio = audio;

      audio.onplay = () => {
        if (onStart) onStart();
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
        this.activeAudio = null;
        if (onEnded) onEnded();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        this.activeAudio = null;
        if (onEnded) onEnded();
      };

      await audio.play();
    } catch {
      if (onEnded) onEnded();
    }
  }

  static stop(): void {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio = null;
    }
  }
}
