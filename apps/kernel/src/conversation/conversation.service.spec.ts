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
        capability: 'ANALYZE',
        domain: 'TRADING',
        confidence: 0.9,
        matchedKeywords: ['analyze', 'trading'],
      }),
    } as unknown as jest.Mocked<IntentService>;

    mockContextBuilder = {
      buildContext: jest.fn().mockResolvedValue({
        capability: 'ANALYZE',
        domain: 'TRADING',
        kernelState: 'RUNNING',
        providerName: 'ollama',
        providerStatus: 'healthy',
        activeModel: 'llama3.2',
        uptimeSeconds: 50,
        timestamp: '2026-07-26T12:00:00.000Z',
      }),
    } as unknown as jest.Mocked<ContextBuilder>;

    mockPromptManager = {
      generateSystemPrompt: jest.fn().mockReturnValue('Mock Grounded System Prompt'),
    } as unknown as jest.Mocked<PromptManager>;

    mockAiManager = {
      chat: jest.fn().mockResolvedValue({
        response: 'Good afternoon, Sir. Gold trading metrics evaluated.',
        model: 'llama3.2',
        done: true,
      }),
      generate: jest.fn(),
      stream: jest.fn(),
      health: jest.fn(),
      getModels: jest.fn(),
    } as unknown as jest.Mocked<AIManager>;

    mockValidator = {
      validatePreGeneration: jest.fn().mockReturnValue({
        isValid: true,
        canBypassLlm: false,
      }),
      validatePostGeneration: jest.fn().mockReturnValue({
        isValid: true,
        sanitizedResponse: 'Good afternoon, Sir. Gold trading metrics evaluated.',
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

  it('should execute refactored Intelligence Pipeline with Pre/Post validation and PromptRequest payload', async () => {
    const result = await service.processMessage({ message: 'Review my Gold trades.' });

    expect(mockValidator.validatePreGeneration).toHaveBeenCalledWith('Review my Gold trades.');
    expect(mockIntentService.analyzeIntent).toHaveBeenCalledWith('Review my Gold trades.');
    expect(mockContextBuilder.buildContext).toHaveBeenCalledWith('ANALYZE', 'TRADING');
    expect(mockPromptManager.generateSystemPrompt).toHaveBeenCalledWith(
      expect.objectContaining({
        capability: 'ANALYZE',
        domain: 'TRADING',
        userMessage: 'Review my Gold trades.',
      }),
    );
    expect(mockAiManager.chat).toHaveBeenCalledWith({
      system: 'Mock Grounded System Prompt',
      prompt: 'Review my Gold trades.',
      model: undefined,
    });
    expect(mockValidator.validatePostGeneration).toHaveBeenCalledWith(
      'Good afternoon, Sir. Gold trading metrics evaluated.',
    );

    expect(result.id).toBeDefined();
    expect(result.message).toBe('Good afternoon, Sir. Gold trading metrics evaluated.');
  });
});
