import { IAIProvider } from './ai.interface';
import { AIManager } from './ai.manager';
import { LoggerManager } from '../logging/logger.manager';

describe('AIManager', () => {
  let mockProvider: jest.Mocked<IAIProvider>;
  let mockLogger: jest.Mocked<LoggerManager>;
  let manager: AIManager;

  beforeEach(() => {
    mockProvider = {
      name: 'mock-ai-provider',
      generate: jest.fn(),
      stream: jest.fn(),
      health: jest.fn(),
      getModels: jest.fn(),
    };

    mockLogger = {
      setContext: jest.fn().mockReturnThis(),
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    } as unknown as jest.Mocked<LoggerManager>;

    manager = new AIManager(mockProvider, mockLogger);
  });

  it('should delegate generate requests to the provider', async () => {
    const request = { prompt: 'Hello AI' };
    const expectedResponse = {
      response: 'Hello human',
      model: 'test-model',
      done: true,
    };
    mockProvider.generate.mockResolvedValue(expectedResponse);

    const result = await manager.generate(request);
    expect(mockProvider.generate).toHaveBeenCalledWith(request);
    expect(result).toEqual(expectedResponse);
  });

  it('should delegate health check to the provider', async () => {
    const expectedHealth = {
      status: 'healthy' as const,
      provider: 'mock-ai-provider',
      modelCount: 1,
    };
    mockProvider.health.mockResolvedValue(expectedHealth);

    const result = await manager.health();
    expect(mockProvider.health).toHaveBeenCalled();
    expect(result).toEqual(expectedHealth);
  });

  it('should delegate model listing to the provider', async () => {
    const expectedModels = [{ name: 'llama3.2' }];
    mockProvider.getModels.mockResolvedValue(expectedModels);

    const result = await manager.getModels();
    expect(mockProvider.getModels).toHaveBeenCalled();
    expect(result).toEqual(expectedModels);
  });
});
