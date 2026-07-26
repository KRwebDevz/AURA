const COMMON_ABBREVIATIONS = new Set([
  'mr',
  'mrs',
  'ms',
  'dr',
  'prof',
  'sr',
  'jr',
  'st',
  'co',
  'inc',
  'ltd',
  'vs',
  'etc',
  'e.g',
  'i.e',
  'eg',
  'ie',
  'approx',
  'no',
  'vol',
  'dept',
  'fig',
]);

export type SentenceCallback = (sentence: string) => void;

export class SentenceStreamProcessor {
  private buffer = '';
  private onSentence: SentenceCallback;

  constructor(onSentence: SentenceCallback) {
    this.onSentence = onSentence;
  }

  /**
   * Processes an incoming text chunk from the streaming response.
   * Buffers text and immediately emits completed sentences.
   */
  processChunk(chunk: string): void {
    if (!chunk) return;
    this.buffer += chunk;

    let i = 0;
    while (i < this.buffer.length) {
      const char = this.buffer[i];

      if (char === '\n' || char === '?' || char === '!' || char === ':') {
        const sentence = this.buffer.slice(0, i + 1).trim();
        if (sentence) {
          this.onSentence(sentence);
        }
        this.buffer = this.buffer.slice(i + 1);
        i = 0;
        continue;
      }

      if (char === '.') {
        // Check if the preceding word is an abbreviation
        const textBeforeDot = this.buffer.slice(0, i);
        const lastWord = textBeforeDot.split(/\s+/).pop()?.toLowerCase() || '';

        if (COMMON_ABBREVIATIONS.has(lastWord)) {
          // It's an abbreviation like "Dr." or "Mr." - skip splitting here
          i++;
          continue;
        }

        // Check if next character is a digit (e.g. 3.14 or v0.1.0)
        const nextChar = this.buffer[i + 1];
        if (nextChar && /\d/.test(nextChar)) {
          i++;
          continue;
        }

        // Sentence boundary found
        const sentence = this.buffer.slice(0, i + 1).trim();
        if (sentence) {
          this.onSentence(sentence);
        }
        this.buffer = this.buffer.slice(i + 1);
        i = 0;
        continue;
      }

      i++;
    }
  }

  /**
   * Emits any remaining text in the buffer when the stream ends.
   */
  flush(): void {
    const remaining = this.buffer.trim();
    if (remaining) {
      this.onSentence(remaining);
    }
    this.buffer = '';
  }

  /**
   * Clears the buffer without emitting remaining text (used on cancel/stop).
   */
  reset(): void {
    this.buffer = '';
  }
}
