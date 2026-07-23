import { Provider } from '@nestjs/common';
import { ConfigurationService } from '../../config/configuration.service';
import { LoggerFactory } from './logger.factory';

export const LOGGER_PROVIDER = 'ILogger';

export const loggerProvider: Provider = {
  provide: LOGGER_PROVIDER,
  useFactory: (configService: ConfigurationService) => {
    return LoggerFactory.create({
      level: configService.logLevel,
      isDevelopment: configService.isDevelopment,
      name: configService.name,
    });
  },
  inject: [ConfigurationService],
};
