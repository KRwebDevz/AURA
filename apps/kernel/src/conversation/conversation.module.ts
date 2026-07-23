import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationManager } from './conversation.manager';
import { ConversationMapper } from './conversation.mapper';
import { ConversationService } from './conversation.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationMapper, ConversationService, ConversationManager],
  exports: [ConversationManager, ConversationService],
})
export class ConversationModule {}
