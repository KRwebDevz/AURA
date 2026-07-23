import pino, { Logger as PinoLogger } from 'pino';
import pinoPretty from 'pino-pretty';
import { ILogger } from './logger.interface';
import { LogContext, LoggerOptions } from './logger.types';

export class PinoLoggerProvider implements ILogger {
  private readonly logger: PinoLogger;

  constructor(options: LoggerOptions) {
    const isDev = options.isDevelopment;

    const pinoOptions = {
      name: options.name || 'AURA',
      level: options.level || 'info',
    };

    if (isDev) {
      const stream = pinoPretty({
        colorize: true,
        singleLine: false,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
      });
      this.logger = pino(pinoOptions, stream);
    } else {
      this.logger = pino(pinoOptions);
    }
  }

  private normalizeContext(context?: LogContext | string): LogContext {
    if (typeof context === 'string') {
      return { context };
    }
    return context || {};
  }

  trace(message: string, context?: LogContext | string): void {
    this.logger.trace(this.normalizeContext(context), message);
  }

  debug(message: string, context?: LogContext | string): void {
    this.logger.debug(this.normalizeContext(context), message);
  }

  info(message: string, context?: LogContext | string): void {
    this.logger.info(this.normalizeContext(context), message);
  }

  warn(message: string, context?: LogContext | string): void {
    this.logger.warn(this.normalizeContext(context), message);
  }

  error(
    message: string,
    error?: Error | unknown,
    context?: LogContext | string,
  ): void {
    const normCtx = this.normalizeContext(context);
    if (error instanceof Error) {
      this.logger.error({ ...normCtx, err: error }, message);
    } else if (error) {
      this.logger.error({ ...normCtx, error }, message);
    } else {
      this.logger.error(normCtx, message);
    }
  }

  fatal(
    message: string,
    error?: Error | unknown,
    context?: LogContext | string,
  ): void {
    const normCtx = this.normalizeContext(context);
    if (error instanceof Error) {
      this.logger.fatal({ ...normCtx, err: error }, message);
    } else if (error) {
      this.logger.fatal({ ...normCtx, error }, message);
    } else {
      this.logger.fatal(normCtx, message);
    }
  }
}
