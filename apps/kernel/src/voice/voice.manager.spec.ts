import { VoiceManager } from './voice.manager';
import { ITTSProvider } from './providers/tts.provider';
import { LoggerManager } from '../platform/logging/logger.manager';

describe('VoiceManager', () => {
  let manager: VoiceManager;
  let mockProvider: jest.Mocked<ITTSProvider>;
  let mockLogger: jest.Mocked<LoggerManager>;

  beforeEach(() => {
    mockProvider = {
      name: 'kokoro',
      synthesize: jest.fn().mockResolvedValue({
        audio: Buffer.from('RIFF_WAVE_MOCK'),
        format: 'wav',
      }),
      health: jest.fn().mockResolvedValue({
        status: 'healthy',
        provider: 'kokoro',
      }),
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

    manager = new VoiceManager(mockProvider, mockLogger);
  });

  it('should delegate speech synthesis to ITTSProvider', async () => {
    const res = await manager.synthesize({ text: 'Status report, Sir.' });

    expect(mockProvider.synthesize).toHaveBeenCalledWith({
      text: 'Status report, Sir.',
    });
    expect(res.format).toBe('wav');
  });

  it('should report TTS provider health', async () => {
    const health = await manager.health();
    expect(health.provider).toBe('kokoro');
    expect(health.status).toBe('healthy');
  });
});
