export type SpeakExecutor = (text: string) => Promise<void>;

interface SpeechQueueItem {
  id: string;
  text: string;
  speakFn: SpeakExecutor;
}

export class SpeechQueue {
  private queue: SpeechQueueItem[] = [];
  private processing = false;

  /**
   * Enqueues a sentence to be spoken sequentially.
   * Starts playback automatically if queue is idle.
   */
  enqueue(text: string, speakFn: SpeakExecutor): void {
    const trimmed = text.trim();
    if (!trimmed) return;

    this.queue.push({
      id: `sq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: trimmed,
      speakFn,
    });

    if (!this.processing) {
      this.processNext();
    }
  }

  /**
   * Immediately clears all pending sentences from the queue.
   */
  clear(): void {
    this.queue = [];
    this.processing = false;
  }

  /**
   * Returns whether the queue is currently processing or has pending items.
   */
  isProcessing(): boolean {
    return this.processing || this.queue.length > 0;
  }

  /**
   * Returns current pending item count in queue.
   */
  size(): number {
    return this.queue.length;
  }

  private async processNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const item = this.queue.shift();

    if (item) {
      try {
        await item.speakFn(item.text);
      } catch {
        // Handle individual sentence speak errors gracefully without breaking queue loop
      }
    }

    // Continue processing remaining items in queue
    this.processNext();
  }
}
