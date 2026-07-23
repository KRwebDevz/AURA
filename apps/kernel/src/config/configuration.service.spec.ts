import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import configuration from './configuration';
import { validateEnv } from './env.schema';

describe('Configuration System', () => {
  describe('envSchema Validation', () => {
    it('should validate valid environment variables', () => {
      const validEnv = {
        AURA_NAME: 'AURA',
        NODE_ENV: 'development',
        PORT: '3000',
        LOG_LEVEL: 'debug',
        TIMEZONE: 'Asia/Kolkata',
        LOCALE: 'en-IN',
      };
      const result = validateEnv(validEnv);
      expect(result.AURA_NAME).toBe('AURA');
      expect(result.NODE_ENV).toBe('development');
      expect(result.PORT).toBe(3000);
      expect(result.LOG_LEVEL).toBe('debug');
      expect(result.TIMEZONE).toBe('Asia/Kolkata');
      expect(result.LOCALE).toBe('en-IN');
    });

    it('should throw error for invalid PORT', () => {
      const invalidEnv = { PORT: 'not-a-number' };
      expect(() => validateEnv(invalidEnv)).toThrow(
        'Invalid Environment Configuration',
      );
    });

    it('should throw error for invalid NODE_ENV', () => {
      const invalidEnv = { NODE_ENV: 'invalid_env' };
      expect(() => validateEnv(invalidEnv)).toThrow(
        'Invalid Environment Configuration',
      );
    });
  });

  describe('ConfigurationService', () => {
    let service: ConfigurationService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            load: [configuration],
            validate: validateEnv,
          }),
        ],
        providers: [ConfigurationService],
      }).compile();

      service = module.get<ConfigurationService>(ConfigurationService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should expose strongly typed configuration getters', () => {
      expect(service.name).toBe('AURA');
      expect(service.version).toBe('0.1.0');
      expect(service.environment).toBeDefined();
      expect(typeof service.port).toBe('number');
      expect(typeof service.isDevelopment).toBe('boolean');
      expect(typeof service.isProduction).toBe('boolean');
      expect(typeof service.isTest).toBe('boolean');
    });
  });
});
