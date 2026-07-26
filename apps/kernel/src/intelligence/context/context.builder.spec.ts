import { ContextBuilder } from './context.builder';
import { KernelContextProvider } from './providers/kernel.context-provider';
import { LoggerManager } from '../../platform/logging/logger.manager';

describe('ContextBuilder', () => {
  let builder: ContextBuilder;
  let mockKernelProvider: jest.Mocked<KernelContextProvider>;
  let mockLogger: jest.Mocked<LoggerManager>;

  beforeEach(() => {
    mockKernelProvider = {
      name: 'kernel',
      getContextData: jest.fn().mockResolvedValue({
        kernelState: 'RUNNING',
        providerName: 'ollama',
        providerStatus: 'healthy',
        activeModel: 'llama3.2',
        uptimeSeconds: 100,
        timestamp: '2026-07-26T12:00:00.000Z',
      }),
    } as unknown as jest.Mocked<KernelContextProvider>;

    mockLogger = {
      setContext: jest.fn().mockReturnThis(),
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    } as unknown as jest.Mocked<LoggerManager>;

    builder = new ContextBuilder(mockKernelProvider, mockLogger);
  });

  it('should aggregate context across context providers', async () => {
    const context = await builder.buildContext('ANALYZE', 'TRADING');

    expect(context.capability).toBe('ANALYZE');
    expect(context.domain).toBe('TRADING');
    expect(context.kernelState).toBe('RUNNING');
    expect(context.providerName).toBe('ollama');
    expect(context.providerStatus).toBe('healthy');
  });
});
