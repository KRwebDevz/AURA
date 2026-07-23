export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type LogContext = Record<string, unknown>;

export interface LoggerOptions {
  level: LogLevel;
  isDevelopment: boolean;
  name?: string;
}
