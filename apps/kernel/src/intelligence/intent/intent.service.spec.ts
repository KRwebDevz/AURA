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

  it('should classify "Review my Gold trades." as ANALYZE capability and TRADING domain', () => {
    const res = service.analyzeIntent('Review my Gold trades.');
    expect(res.capability).toBe('ANALYZE');
    expect(res.domain).toBe('TRADING');
  });

  it('should classify code questions as QUESTION capability and DEVELOPMENT domain', () => {
    const res = service.analyzeIntent('Explain how NestJS dependency injection works in this code.');
    expect(res.capability).toBe('QUESTION');
    expect(res.domain).toBe('DEVELOPMENT');
  });

  it('should classify schedule prompts as PLAN capability and PERSONAL domain', () => {
    const res = service.analyzeIntent('Plan my schedule for tomorrow morning.');
    expect(res.capability).toBe('PLAN');
    expect(res.domain).toBe('PERSONAL');
  });
});
