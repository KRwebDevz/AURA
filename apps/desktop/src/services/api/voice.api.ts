const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class VoiceApi {
  static async synthesize(text: string, voice?: string): Promise<ArrayBuffer> {
    const url = `${API_BASE_URL}/voice/synthesize`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      throw new Error(
        `Voice synthesis request failed with status ${response.status}: ${response.statusText}`,
      );
    }

    return response.arrayBuffer();
  }
}
