import { Injectable } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import {
  ConversationResponse,
  CreateConversationRequest,
} from './conversation.types';
import { LoggerManager } from '../platform/logging/logger.manager';

@Injectable()
export class ConversationManager {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly logger: LoggerManager,
  ) {
    this.logger.setContext('ConversationManager');
  }

  async handleConversation(
    request: CreateConversationRequest,
  ): Promise<ConversationResponse> {
    this.logger.debug('Handling conversation turn');
    return this.conversationService.processMessage(request);
  }
}
