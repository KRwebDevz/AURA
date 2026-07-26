import { StreamChunkPayload } from '../../../types';
import { ConversationApi } from '../../../services/api/conversation.api';

export interface StreamOptions {
  model?: string;
  signal?: AbortSignal;
  onChunk: (payload: StreamChunkPayload) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
}

export class ConversationStreamClient {
  /**
   * Executes a single-stream SSE request to the Kernel backend.
   * Handles immediate chunk delivery, cancellation via AbortSignal, and completion.
   */
  static async stream(
    message: string,
    options: StreamOptions,
  ): Promise<void> {
    const { signal, onChunk, onError, onComplete } = options;

    return ConversationApi.streamMessage(
      message,
      onChunk,
      onError,
      onComplete,
      signal,
    );
  }
}
