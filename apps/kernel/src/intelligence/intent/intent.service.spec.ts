import { IntentService } from './intent.service';
import { LoggerManager } from '../../platform/logging/logger.manager';

describe('IntentService', () => {
  let service: IntentService;
  let mockLogger: jest.Mocked<LoggerManager>;

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

    service = new IntentService(mockLogger);
  });

  it('should classify status prompts as SYSTEM_STATUS', () => {
    const res = service.analyzeIntent('AURA, report system status.');
    expect(res.intent).toBe('SYSTEM_STATUS');
    expect(res.matchedKeywords).toContain('status');
  });

  it('should classify schedule prompts as PLANNING', () => {
    const res = service.analyzeIntent('Review today agenda and schedule.');
    expect(res.intent).toBe('PLANNING');
    expect(res.matchedKeywords).toContain('schedule');
  });

  it('should classify code prompts as DEVELOPMENT', () => {
    const res = service.analyzeIntent('Explain the architecture of this typescript module.');
    expect(res.intent).toBe('DEVELOPMENT');
  });

  it('should fallback to GENERAL_CHAT for conversational text', () => {
    const res = service.analyzeIntent('Good morning AURA');
    expect(res.intent).toBe('GENERAL_CHAT');
  });
});
