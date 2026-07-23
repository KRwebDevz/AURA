import { Body, Controller, Post } from '@nestjs/common';
import { ConversationManager } from './conversation.manager';
import type {
  ConversationResponse,
  CreateConversationRequest,
} from './conversation.types';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationManager: ConversationManager) {}

  @Post()
  async createConversation(
    @Body() body: CreateConversationRequest,
  ): Promise<ConversationResponse> {
    if (!body || !body.message) {
      throw new Error("Missing required 'message' field in request body.");
    }
    return this.conversationManager.handleConversation(body);
  }
}
