import { AIManager } from '../platform/ai/ai.manager';
import { LoggerManager } from '../platform/logging/logger.manager';
import { PersonaManager } from '../platform/persona/persona.manager';
import { ConversationMapper } from './conversation.mapper';
import { ConversationService } from './conversation.service';

describe('ConversationService', () => {
  let mockAiManager: jest.Mocked<AIManager>;
  let mockPersonaManager: jest.Mocked<PersonaManager>;
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

    mockPersonaManager = {
      getSystemPrompt: jest.fn().mockReturnValue('Mock System Prompt'),
      getPersona: jest.fn(),
      getDefaultPersona: jest.fn(),
    } as unknown as jest.Mocked<PersonaManager>;

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

    service = new ConversationService(
      mockAiManager,
      mockPersonaManager,
      mapper,
      mockLogger,
    );
  });

  it('should process user message with PersonaManager system prompt and return mapped DTO', async () => {
    mockAiManager.chat.mockResolvedValue({
      response: 'Good afternoon, Sir. I am ready to assist you.',
      model: 'llama3.2',
      done: true,
    });

    const result = await service.processMessage({ message: 'Status report' });

    expect(mockPersonaManager.getSystemPrompt).toHaveBeenCalled();
    expect(mockAiManager.chat).toHaveBeenCalledWith({
      system: 'Mock System Prompt',
      prompt: 'Status report',
      model: undefined,
    });

    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.message).toBe('Good afternoon, Sir. I am ready to assist you.');
    expect(result.provider).toBe('ollama');
    expect(result.model).toBe('llama3.2');
  });
});
