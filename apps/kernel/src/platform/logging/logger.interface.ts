import { LogContext } from './logger.types';

export interface ILogger {
  trace(message: string, context?: LogContext | string): void;
  debug(message: string, context?: LogContext | string): void;
  info(message: string, context?: LogContext | string): void;
  warn(message: string, context?: LogContext | string): void;
  error(message: string, error?: Error | unknown, context?: LogContext | string): void;
  fatal(message: string, error?: Error | unknown, context?: LogContext | string): void;
}
