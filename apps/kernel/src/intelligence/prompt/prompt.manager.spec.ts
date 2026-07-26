import { PromptManager } from './prompt.manager';
import { PersonaManager } from '../../platform/persona/persona.manager';
import { LoggerManager } from '../../platform/logging/logger.manager';
import { PromptRequest } from './prompt.request';

describe('PromptManager', () => {
  let manager: PromptManager;
  let mockPersonaManager: jest.Mocked<PersonaManager>;
  let mockLogger: jest.Mocked<LoggerManager>;

  beforeEach(() => {
    mockPersonaManager = {
      getSystemPrompt: jest.fn().mockReturnValue('Base Executive Persona Prompt'),
    } as unknown as jest.Mocked<PersonaManager>;

    mockLogger = {
      setContext: jest.fn().mockReturnThis(),
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    } as unknown as jest.Mocked<LoggerManager>;

    manager = new PromptManager(mockPersonaManager, mockLogger);
  });

  it('should accept PromptRequest object and generate grounded system prompt', () => {
    const mockRequest: PromptRequest = {
      capability: 'ANALYZE',
      domain: 'TRADING',
      userMessage: 'Review my Gold trades',
      context: {
        capability: 'ANALYZE',
        domain: 'TRADING',
        kernelState: 'RUNNING',
        providerName: 'ollama',
        providerStatus: 'healthy',
        activeModel: 'llama3.2',
        uptimeSeconds: 120,
        timestamp: '2026-07-26T12:00:00.000Z',
      },
    };

    const prompt = manager.generateSystemPrompt(mockRequest);

    expect(prompt).toContain('Base Executive Persona Prompt');
    expect(prompt).toContain('Capability: ANALYZE');
    expect(prompt).toContain('Domain: TRADING');
    expect(prompt).toContain('Direct Capability Instruction');
  });
});
