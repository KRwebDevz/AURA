import { Inject, Injectable } from '@nestjs/common';
import type { ILogger } from './logger.interface';
import { LOGGER_PROVIDER } from './logger.provider';
import { LogContext } from './logger.types';

@Injectable()
export class LoggerManager implements ILogger {
  private contextName?: string;

  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: ILogger) {}

  setContext(contextName: string): this {
    this.contextName = contextName;
    return this;
  }

  private resolveContext(context?: LogContext | string): LogContext | string {
    if (context) {
      if (typeof context === 'string' && this.contextName) {
        return { context: `${this.contextName}:${context}` };
      }
      if (typeof context === 'object' && this.contextName && !context.context) {
        return { ...context, context: this.contextName };
      }
      return context;
    }
    return this.contextName ? { context: this.contextName } : {};
  }

  trace(message: string, context?: LogContext | string): void {
    this.logger.trace(message, this.resolveContext(context));
  }

  debug(message: string, context?: LogContext | string): void {
    this.logger.debug(message, this.resolveContext(context));
  }

  info(message: string, context?: LogContext | string): void {
    this.logger.info(message, this.resolveContext(context));
  }

  warn(message: string, context?: LogContext | string): void {
    this.logger.warn(message, this.resolveContext(context));
  }

  error(
    message: string,
    error?: Error | unknown,
    context?: LogContext | string,
  ): void {
    this.logger.error(message, error, this.resolveContext(context));
  }

  fatal(
    message: string,
    error?: Error | unknown,
    context?: LogContext | string,
  ): void {
    this.logger.fatal(message, error, this.resolveContext(context));
  }
}
