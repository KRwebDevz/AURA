import { AIManager } from '../platform/ai/ai.manager';
import { LoggerManager } from '../platform/logging/logger.manager';
import { ConversationMapper } from './conversation.mapper';
import { ConversationService } from './conversation.service';
import { AURA_PERSONA_001 } from './prompts/persona-001';

describe('ConversationService', () => {
  let mockAiManager: jest.Mocked<AIManager>;
  let mapper: ConversationMapper;
  let mockLogger: jest.Mocked<LoggerManager>;
  let service: ConversationService;

  beforeEach(() => {
    mockAiManager = {
      chat: jest.fn(),
      generate: jest.fn(),
      stream: jest.fn(),
      health: jest.fn(),
      getModels: jest.fn(),
    } as unknown as jest.Mocked<AIManager>;

    mapper = new ConversationMapper();

    mockLogger = {
      setContext: jest.fn().mockReturnThis(),
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    } as unknown as jest.Mocked<LoggerManager>;

    service = new ConversationService(mockAiManager, mapper, mockLogger);
  });

  it('should process user message with PERSONA-001 prompt and return mapped DTO', async () => {
    mockAiManager.chat.mockResolvedValue({
      response: 'Hello user, I am AURA.',
      model: 'llama3.2',
      done: true,
    });

    const result = await service.processMessage({ message: 'Hello AURA' });

    expect(mockAiManager.chat).toHaveBeenCalledWith({
      system: AURA_PERSONA_001,
      prompt: 'Hello AURA',
      model: undefined,
    });

    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.message).toBe('Hello user, I am AURA.');
    expect(result.provider).toBe('ollama');
    expect(result.model).toBe('llama3.2');
  });
});
