import { ContextBuilder } from './context.builder';
import { LifecycleManager } from '../../platform/lifecycle/lifecycle.manager';
import { AIManager } from '../../platform/ai/ai.manager';
import { ConfigurationService } from '../../config/configuration.service';
import { LoggerManager } from '../../platform/logging/logger.manager';

describe('ContextBuilder', () => {
  let builder: ContextBuilder;
  let mockLifecycle: jest.Mocked<LifecycleManager>;
  let mockAiManager: jest.Mocked<AIManager>;
  let mockConfig: jest.Mocked<ConfigurationService>;
  let mockLogger: jest.Mocked<LoggerManager>;

  beforeEach(() => {
    mockLifecycle = {
      getState: jest.fn().mockReturnValue('RUNNING'),
    } as unknown as jest.Mocked<LifecycleManager>;

    mockAiManager = {
      health: jest.fn().mockResolvedValue({
        status: 'healthy',
        provider: 'ollama',
        modelCount: 1,
      }),
    } as unknown as jest.Mocked<AIManager>;

    mockConfig = {
      ollamaDefaultModel: 'llama3.2',
    } as unknown as jest.Mocked<ConfigurationService>;

    mockLogger = {
      setContext: jest.fn().mockReturnThis(),
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    } as unknown as jest.Mocked<LoggerManager>;

    builder = new ContextBuilder(
      mockLifecycle,
      mockAiManager,
      mockConfig,
      mockLogger,
    );
  });

  it('should build strongly typed IntelligenceContext with runtime telemetry', async () => {
    const context = await builder.buildContext('SYSTEM_STATUS');

    expect(context.kernelState).toBe('RUNNING');
    expect(context.providerName).toBe('ollama');
    expect(context.providerStatus).toBe('healthy');
    expect(context.activeModel).toBe('llama3.2');
    expect(context.intent).toBe('SYSTEM_STATUS');
  });
});
