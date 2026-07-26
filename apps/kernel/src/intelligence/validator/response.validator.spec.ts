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

  it('should fail pre-validation for empty user prompts', () => {
    const pre = validator.validatePreGeneration('   ');
    expect(pre.isValid).toBe(false);
    expect(pre.canBypassLlm).toBe(true);
    expect(pre.fallbackResponse).toContain('Sir, please provide a command');
  });

  it('should pass pre-validation for valid user prompts', () => {
    const pre = validator.validatePreGeneration('Review my Gold trades.');
    expect(pre.isValid).toBe(true);
    expect(pre.canBypassLlm).toBe(false);
  });

  it('should reject post-validation for empty AI responses', () => {
    const post = validator.validatePostGeneration('   ');
    expect(post.isValid).toBe(false);
    expect(post.sanitizedResponse).toContain('Sir, all system status signals are nominal');
  });

  it('should append disclaimer for hallucinated claims of external modules', () => {
    const post = validator.validatePostGeneration(
      'Good morning. I accessed your google calendar and scheduled the meeting.',
    );
    expect(post.isValid).toBe(true);
    expect(post.sanitizedResponse).toContain('External service integration modules remain standing by');
  });
});
