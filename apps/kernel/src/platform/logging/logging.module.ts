import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerManager } from './logger.manager';
import { LOGGER_PROVIDER, loggerProvider } from './logger.provider';
import { LoggingInterceptor } from './logging.interceptor';

@Global()
@Module({
  providers: [
    loggerProvider,
    LoggerManager,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [LOGGER_PROVIDER, LoggerManager],
})
export class LoggingModule {}
