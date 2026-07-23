import { Controller, Get } from '@nestjs/common';
import { KernelService, type HealthResponse } from './kernel.service';

@Controller()
export class KernelController {
  constructor(private readonly kernelService: KernelService) {}

  @Get('health')
  getHealth(): HealthResponse {
    return this.kernelService.getHealth();
  }
}
