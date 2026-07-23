export type NodeEnv = 'development' | 'production' | 'test';
export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface EnvironmentVariables {
  AURA_NAME: string;
  NODE_ENV: NodeEnv;
  PORT: number;
  LOG_LEVEL: LogLevel;
  TIMEZONE: string;
  LOCALE: string;
  OLLAMA_BASE_URL: string;
  OLLAMA_DEFAULT_MODEL: string;
}

export interface AppConfig {
  name: string;
  version: string;
  environment: NodeEnv;
  port: number;
  logLevel: LogLevel;
  timezone: string;
  locale: string;
  ollamaBaseUrl: string;
  ollamaDefaultModel: string;
}
