import { PromptManager } from './prompt.manager';
import { PersonaManager } from '../../platform/persona/persona.manager';
import { LoggerManager } from '../../platform/logging/logger.manager';
import { IntelligenceContext } from '../context/context.types';

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

  it('should generate grounded prompt injecting runtime telemetry', () => {
    const mockContext: IntelligenceContext = {
      kernelState: 'RUNNING',
      providerName: 'ollama',
      providerStatus: 'healthy',
      activeModel: 'llama3.2',
      uptimeSeconds: 120,
      timestamp: '2026-07-26T12:00:00.000Z',
      intent: 'SYSTEM_STATUS',
    };

    const prompt = manager.generateSystemPrompt(mockContext);

    expect(prompt).toContain('Base Executive Persona Prompt');
    expect(prompt).toContain('Kernel State: RUNNING');
    expect(prompt).toContain('Active Model: llama3.2');
    expect(prompt).toContain('Direct Intent Instruction');
  });
});
