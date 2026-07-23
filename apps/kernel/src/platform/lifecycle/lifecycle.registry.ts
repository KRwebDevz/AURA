import { Injectable } from '@nestjs/common';
import type { ILifecycleParticipant } from './lifecycle.interface';

@Injectable()
export class LifecycleRegistry {
  private readonly participants: Map<string, ILifecycleParticipant> = new Map();

  register(participant: ILifecycleParticipant): void {
    if (this.participants.has(participant.name)) {
      throw new Error(
        `Lifecycle participant '${participant.name}' is already registered.`,
      );
    }
    this.participants.set(participant.name, participant);
  }

  get(name: string): ILifecycleParticipant | undefined {
    return this.participants.get(name);
  }

  getAll(): ILifecycleParticipant[] {
    return Array.from(this.participants.values());
  }

  has(name: string): boolean {
    return this.participants.has(name);
  }

  clear(): void {
    this.participants.clear();
  }
}
