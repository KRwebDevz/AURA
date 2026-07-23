import { Test, TestingModule } from '@nestjs/testing';
import { KernelController } from './kernel.controller';
import { KernelService } from './kernel.service';
import { ConfigurationModule } from '../config/configuration.module';
import { LoggingModule } from '../platform/logging/logging.module';
import { LifecycleModule } from '../platform/lifecycle/lifecycle.module';

describe('KernelController', () => {
  let kernelController: KernelController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule, LoggingModule, LifecycleModule],
      controllers: [KernelController],
      providers: [KernelService],
    }).compile();

    kernelController = app.get<KernelController>(KernelController);
  });

  describe('getHealth', () => {
    it('should return structured health response including kernel state', () => {
      const health = kernelController.getHealth();
      expect(health.name).toBe('AURA');
      expect(health.version).toBe('0.1.0');
      expect(health.environment).toBeDefined();
      expect(health.status).toBe('healthy');
      expect(typeof health.uptime).toBe('number');
      expect(typeof health.timestamp).toBe('string');
      expect(health.kernel).toBeDefined();
      expect(health.kernel.state).toBeDefined();
    });
  });
});
