import { KokoroProvider } from './kokoro.provider';

describe('KokoroProvider', () => {
  let provider: KokoroProvider;

  beforeEach(() => {
    provider = new KokoroProvider({
      baseUrl: 'http://localhost:8880',
      defaultVoice: 'af_bella',
    });
  });

  it('should have provider name kokoro', () => {
    expect(provider.name).toBe('kokoro');
  });

  it('should return fallback WAV audio buffer when Kokoro server is offline', async () => {
    const response = await provider.synthesize({ text: 'Good morning Sir.' });

    expect(response.format).toBe('wav');
    expect(response.audio).toBeDefined();
    expect(response.audio.length).toBeGreaterThan(44);
    // Check RIFF header magic bytes
    expect(response.audio.toString('ascii', 0, 4)).toBe('RIFF');
    expect(response.audio.toString('ascii', 8, 12)).toBe('WAVE');
  });

  it('should report health status', async () => {
    const health = await provider.health();
    expect(health.provider).toBe('kokoro');
    expect(health.status).toBeDefined();
  });
});
