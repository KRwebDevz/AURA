import { PersonaManager } from './persona.manager';
import { LoggerManager } from '../logging/logger.manager';

describe('PersonaManager', () => {
  let mockLogger: jest.Mocked<LoggerManager>;
  let manager: PersonaManager;

  beforeEach(() => {
    mockLogger = {
      setContext: jest.fn().mockReturnThis(),
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    } as unknown as jest.Mocked<LoggerManager>;

    manager = new PersonaManager(mockLogger);
  });

  it('should return PERSONA-001 as default persona', () => {
    const persona = manager.getDefaultPersona();
    expect(persona.id).toBe('persona-001');
    expect(persona.name).toBe('AURA Executive Partner');
    expect(persona.systemPrompt).toContain('executive personal intelligence operating system');
  });

  it('should retrieve system prompt for persona-001', () => {
    const prompt = manager.getSystemPrompt('persona-001');
    expect(prompt).toContain('calm authority');
  });

  it('should fallback to default persona when unknown ID is requested', () => {
    const persona = manager.getPersona('unknown-persona');
    expect(persona.id).toBe('persona-001');
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Persona 'unknown-persona' not found"),
    );
  });
});
