import { ResponseValidator } from './response.validator';
import { LoggerManager } from '../../platform/logging/logger.manager';

describe('ResponseValidator', () => {
  let validator: ResponseValidator;
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

    validator = new ResponseValidator(mockLogger);
  });

  it('should reject empty responses', () => {
    const res = validator.validateResponse('   ');
    expect(res.isValid).toBe(false);
    expect(res.sanitizedResponse).toContain('Sir, all system status signals are nominal');
  });

  it('should append disclaimer for hallucinated claims of external modules', () => {
    const res = validator.validateResponse(
      'Good morning. I accessed your google calendar and scheduled the meeting.',
    );
    expect(res.isValid).toBe(true);
    expect(res.sanitizedResponse).toContain('External service integration modules remain standing by');
  });

  it('should accept valid clean responses', () => {
    const res = validator.validateResponse('All systems operational, Sir.');
    expect(res.isValid).toBe(true);
    expect(res.sanitizedResponse).toBe('All systems operational, Sir.');
  });
});
