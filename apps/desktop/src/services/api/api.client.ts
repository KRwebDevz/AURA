const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export class ApiClient {
  static async post<T>(endpoint: string, body: unknown): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP request to ${endpoint} failed with status ${response.status}: ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  }
}
