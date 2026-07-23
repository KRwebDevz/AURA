import { OllamaProvider } from './ollama.provider';

describe('OllamaProvider', () => {
  let provider: OllamaProvider;
  const mockOptions = {
    baseUrl: 'http://localhost:11434',
    defaultModel: 'llama3.2',
  };

  beforeEach(() => {
    provider = new OllamaProvider(mockOptions);
    jest.clearAllMocks();
  });

  it('should send POST request to /api/generate', async () => {
    const fakeFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        response: 'Hello from Ollama',
        model: 'llama3.2',
        done: true,
        total_duration: 500000000,
      }),
    });
    global.fetch = fakeFetch as unknown as typeof fetch;

    const res = await provider.generate({ prompt: 'Hello' });

    expect(fakeFetch).toHaveBeenCalledWith(
      'http://localhost:11434/api/generate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: 'Hello',
          stream: false,
        }),
      }),
    );
    expect(res.response).toBe('Hello from Ollama');
    expect(res.totalDurationMs).toBe(500);
  });

  it('should list models from /api/tags', async () => {
    const fakeFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        models: [
          { name: 'llama3.2:latest', size: 2000000000, modified_at: '2026-01-01' },
        ],
      }),
    });
    global.fetch = fakeFetch as unknown as typeof fetch;

    const models = await provider.getModels();
    expect(fakeFetch).toHaveBeenCalledWith('http://localhost:11434/api/tags');
    expect(models).toHaveLength(1);
    expect(models[0].name).toBe('llama3.2:latest');
  });

  it('should return unhealthy status when daemon is offline', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Connection refused'));

    const health = await provider.health();
    expect(health.status).toBe('unhealthy');
    expect(health.provider).toBe('ollama');
    expect(health.modelCount).toBe(0);
  });
});
