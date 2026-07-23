import { ILogger } from './logger.interface';
import { LoggerManager } from './logger.manager';

describe('LoggerManager', () => {
  let mockLogger: jest.Mocked<ILogger>;
  let manager: LoggerManager;

  beforeEach(() => {
    mockLogger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    manager = new LoggerManager(mockLogger);
  });

  it('should forward info log to underlying logger', () => {
    manager.info('Test info message');
    expect(mockLogger.info).toHaveBeenCalledWith('Test info message', {});
  });

  it('should apply context when setContext is used', () => {
    manager.setContext('TestContext');
    manager.debug('Debug message');
    expect(mockLogger.debug).toHaveBeenCalledWith('Debug message', {
      context: 'TestContext',
    });
  });

  it('should forward error and fatal calls with error objects', () => {
    const err = new Error('Test error');
    manager.error('Something failed', err);
    expect(mockLogger.error).toHaveBeenCalledWith('Something failed', err, {});

    manager.fatal('Critical failure', err);
    expect(mockLogger.fatal).toHaveBeenCalledWith('Critical failure', err, {});
  });
});
