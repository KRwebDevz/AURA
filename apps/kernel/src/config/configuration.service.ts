import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEY } from './constants';
import { AppConfig, LogLevel, NodeEnv } from './types';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  private get config(): AppConfig {
    const appConfig = this.configService.get<AppConfig>(CONFIG_KEY);
    if (!appConfig) {
      throw new Error('Application configuration is not initialized');
    }
    return appConfig;
  }

  get name(): string {
    return this.config.name;
  }

  get version(): string {
    return this.config.version;
  }

  get environment(): NodeEnv {
    return this.config.environment;
  }

  get port(): number {
    return this.config.port;
  }

  get logLevel(): LogLevel {
    return this.config.logLevel;
  }

  get timezone(): string {
    return this.config.timezone;
  }

  get locale(): string {
    return this.config.locale;
  }

  get isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  get isProduction(): boolean {
    return this.config.environment === 'production';
  }

  get isTest(): boolean {
    return this.config.environment === 'test';
  }
}
