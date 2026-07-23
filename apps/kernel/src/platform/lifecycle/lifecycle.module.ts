import { Global, Module } from '@nestjs/common';
import { LifecycleManager } from './lifecycle.manager';
import { LifecycleRegistry } from './lifecycle.registry';

@Global()
@Module({
  providers: [LifecycleRegistry, LifecycleManager],
  exports: [LifecycleRegistry, LifecycleManager],
})
export class LifecycleModule {}
