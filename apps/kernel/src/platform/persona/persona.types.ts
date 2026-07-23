export interface PersonaDefinition {
  id: string;
  name: string;
  tone: string;
  systemPrompt: string;
  metadata?: Record<string, unknown>;
}
