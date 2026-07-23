import { Global, Module } from '@nestjs/common';
import { PersonaManager } from './persona.manager';

@Global()
@Module({
  providers: [PersonaManager],
  exports: [PersonaManager],
})
export class PersonaModule {}
