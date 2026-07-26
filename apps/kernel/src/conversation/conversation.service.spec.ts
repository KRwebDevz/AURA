import { AIManager } from '../platform/ai/ai.manager';
import { LoggerManager } from '../platform/logging/logger.manager';
import { IntentService } from '../intelligence/intent/intent.service';
import { ContextBuilder } from '../intelligence/context/context.builder';
import { PromptManager } from '../intelligence/prompt/prompt.manager';
import { ResponseValidator } from '../intelligence/validator/response.validator';
import { ConversationMapper } from './conversation.mapper';
import { ConversationService } from './conversation.service';

describe('ConversationService', () => {
  let mockIntentService: jest.Mocked<IntentService>;
  let mockContextBuilder: jest.Mocked<ContextBuilder>;
  let mockPromptManager: jest.Mocked<PromptManager>;
  let mockAiManager: jest.Mocked<AIManager>;
  let mockValidator: jest.Mocked<ResponseValidator>;
  let mapper: ConversationMapper;
  let mockLogger: jest.Mocked<LoggerManager>;
  let service: ConversationService;

  beforeEach(() => {
    mockIntentService = {
      analyzeIntent: jest.fn().mockReturnValue({
        intent: 'SYSTEM_STATUS',
        confidence: 0.9,
        matchedKeywords: ['status'],
      }),
    } as unknown as jest.Mocked<IntentService>;

    mockContextBuilder = {
      buildContext: jest.fn().mockResolvedValue({
        kernelState: 'RUNNING',
        providerName: 'ollama',
        providerStatus: 'healthy',
        activeModel: 'llama3.2',
        uptimeSeconds: 50,
        timestamp: '2026-07-26T12:00:00.000Z',
        intent: 'SYSTEM_STATUS',
      }),
    } as unknown as jest.Mocked<ContextBuilder>;

    mockPromptManager = {
      generateSystemPrompt: jest.fn().mockReturnValue('Mock Grounded System Prompt'),
    } as unknown as jest.Mocked<PromptManager>;

    mockAiManager = {
      chat: jest.fn().mockResolvedValue({
        response: 'Good afternoon, Sir. Systems are operational.',
        model: 'llama3.2',
        done: true,
      }),
      generate: jest.fn(),
      stream: jest.fn(),
      health: jest.fn(),
      getModels: jest.fn(),
    } as unknown as jest.Mocked<AIManager>;

    mockValidator = {
      validateResponse: jest.fn().mockReturnValue({
        isValid: true,
        sanitizedResponse: 'Good afternoon, Sir. Systems are operational.',
      }),
    } as unknown as jest.Mocked<ResponseValidator>;

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
      mockIntentService,
      mockContextBuilder,
      mockPromptManager,
      mockAiManager,
      mockValidator,
      mapper,
      mockLogger,
    );
  });

  it('should execute sequential Intelligence Pipeline: Intent -> Context -> Prompt -> AI -> Validator', async () => {
    const result = await service.processMessage({ message: 'Status report' });

    expect(mockIntentService.analyzeIntent).toHaveBeenCalledWith('Status report');
    expect(mockContextBuilder.buildContext).toHaveBeenCalledWith('SYSTEM_STATUS');
    expect(mockPromptManager.generateSystemPrompt).toHaveBeenCalled();
    expect(mockAiManager.chat).toHaveBeenCalledWith({
      system: 'Mock Grounded System Prompt',
      prompt: 'Status report',
      model: undefined,
    });
    expect(mockValidator.validateResponse).toHaveBeenCalledWith(
      'Good afternoon, Sir. Systems are operational.',
    );

    expect(result.id).toBeDefined();
    expect(result.message).toBe('Good afternoon, Sir. Systems are operational.');
    expect(result.provider).toBe('ollama');
    expect(result.model).toBe('llama3.2');
  });
});
