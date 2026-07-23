export interface CreateConversationRequest {
  message: string;
  model?: string;
}

export interface ConversationResponse {
  id: string;
  message: string;
  provider: string;
  model: string;
}
