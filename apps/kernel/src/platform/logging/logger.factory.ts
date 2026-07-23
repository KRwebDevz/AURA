import { ILogger } from './logger.interface';
import { LoggerOptions } from './logger.types';
import { PinoLoggerProvider } from './pino.provider';

export class LoggerFactory {
  static create(options: LoggerOptions): ILogger {
    return new PinoLoggerProvider(options);
  }
}
