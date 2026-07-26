export interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface ITTSProvider {
  readonly name: string;
  speak(text: string, options?: TTSOptions): Promise<void>;
  stop(): void;
  isAvailable(): Promise<boolean>;
}
