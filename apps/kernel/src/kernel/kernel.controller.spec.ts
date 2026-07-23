import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { KernelController } from './kernel.controller';
import { KernelService } from './kernel.service';
import { ConfigurationService } from '../config/configuration.service';
import configuration from '../config/configuration';
import { validateEnv } from '../config/env.schema';

describe('KernelController', () => {
  let kernelController: KernelController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          validate: validateEnv,
        }),
      ],
      controllers: [KernelController],
      providers: [KernelService, ConfigurationService],
    }).compile();

    kernelController = app.get<KernelController>(KernelController);
  });

  describe('getHealth', () => {
    it('should return structured health response including environment', () => {
      const health = kernelController.getHealth();
      expect(health.name).toBe('AURA');
      expect(health.version).toBe('0.1.0');
      expect(health.environment).toBeDefined();
      expect(health.status).toBe('healthy');
      expect(typeof health.uptime).toBe('number');
      expect(typeof health.timestamp).toBe('string');
    });
  });
});
