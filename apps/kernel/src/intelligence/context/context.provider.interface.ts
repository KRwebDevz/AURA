export interface IContextProvider {
  readonly name: string;
  getContextData(): Promise<Record<string, unknown>>;
}
