export const CONFIG_KEY = 'app';

export const DEFAULT_CONFIG = {
  AURA_NAME: 'AURA',
  NODE_ENV: 'development',
  PORT: 3000,
  LOG_LEVEL: 'debug',
  TIMEZONE: 'Asia/Kolkata',
  LOCALE: 'en-IN',
  OLLAMA_BASE_URL: 'http://localhost:11434',
  OLLAMA_DEFAULT_MODEL: 'llama3.2',
} as const;
