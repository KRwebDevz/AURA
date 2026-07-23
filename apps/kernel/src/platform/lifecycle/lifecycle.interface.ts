export interface ILifecycleParticipant {
  readonly name: string;
  initialize?(): Promise<void> | void;
  start?(): Promise<void> | void;
  stop?(): Promise<void> | void;
  health?(): Promise<Record<string, unknown>> | Record<string, unknown>;
}
