import { ApiClient } from './api.client';
import { BackendConversationResponse, StreamChunkPayload } from '../../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class ConversationApi {
  static async sendMessage(
    message: string,
  ): Promise<BackendConversationResponse> {
    return ApiClient.post<BackendConversationResponse>('conversation', {
      message,
    });
  }

  static async streamMessage(
    message: string,
    onChunk: (payload: StreamChunkPayload) => void,
    onError: (error: Error) => void,
    onComplete: () => void,
    signal?: AbortSignal,
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(
          `Stream request failed with status ${response.status}: ${response.statusText}`,
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        if (signal?.aborted) {
          onComplete();
          return;
        }

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr) continue;

            try {
              const payload = JSON.parse(jsonStr) as StreamChunkPayload;
              if (payload.error) {
                onError(new Error(payload.error));
                return;
              }
              onChunk(payload);
              if (payload.done) {
                onComplete();
                return;
              }
            } catch {
              // Ignore non-JSON lines
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      if (signal?.aborted || (error instanceof Error && error.name === 'AbortError')) {
        // Stream was explicitly aborted by user action - trigger complete
        onComplete();
        return;
      }
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
