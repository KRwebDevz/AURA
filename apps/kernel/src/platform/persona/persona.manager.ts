import { Injectable } from '@nestjs/common';
import { PersonaDefinition } from './persona.types';
import { PERSONA_001 } from './personas/persona-001';
import { LoggerManager } from '../logging/logger.manager';

@Injectable()
export class PersonaManager {
  private readonly personas: Map<string, PersonaDefinition> = new Map();
  private readonly defaultPersonaId = 'persona-001';

  constructor(private readonly logger: LoggerManager) {
    this.logger.setContext('PersonaManager');
    this.registerPersona(PERSONA_001);
  }

  registerPersona(persona: PersonaDefinition): void {
    this.personas.set(persona.id, persona);
    this.logger.debug(`Registered persona '${persona.id}' (${persona.name})`);
  }

  getPersona(id: string = this.defaultPersonaId): PersonaDefinition {
    const persona = this.personas.get(id);
    if (!persona) {
      this.logger.warn(
        `Persona '${id}' not found, falling back to default '${this.defaultPersonaId}'`,
      );
      return this.getDefaultPersona();
    }
    return persona;
  }

  getDefaultPersona(): PersonaDefinition {
    const persona = this.personas.get(this.defaultPersonaId);
    if (!persona) {
      throw new Error(`Default persona '${this.defaultPersonaId}' is not registered.`);
    }
    return persona;
  }

  getSystemPrompt(id?: string): string {
    return this.getPersona(id).systemPrompt;
  }
}
