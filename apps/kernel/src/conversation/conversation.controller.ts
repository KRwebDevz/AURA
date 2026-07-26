import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
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

  @Post('stream')
  async streamConversation(
    @Body() body: CreateConversationRequest,
    @Res() res: Response,
  ): Promise<void> {
    if (!body || !body.message) {
      res.status(400).json({ error: "Missing required 'message' field." });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      const stream =
        this.conversationManager.handleStreamingConversation(body);

      for await (const chunkPayload of stream) {
        res.write(`data: ${JSON.stringify(chunkPayload)}\n\n`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      res.write(
        `data: ${JSON.stringify({ error: errorMsg, done: true })}\n\n`,
      );
    } finally {
      res.end();
    }
  }
}
