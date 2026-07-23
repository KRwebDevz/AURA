import { ApiClient } from './api.client';
import { BackendConversationResponse } from '../../types';

export class ConversationApi {
  static async sendMessage(
    message: string,
  ): Promise<BackendConversationResponse> {
    return ApiClient.post<BackendConversationResponse>('conversation', {
      message,
    });
  }
}
