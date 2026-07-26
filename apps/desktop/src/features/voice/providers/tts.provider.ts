export interface ITTSProvider {
  readonly name: string;
  speak(text: string, voice?: string): Promise<void>;
  stop(): void;
  isAvailable(): Promise<boolean>;
}
