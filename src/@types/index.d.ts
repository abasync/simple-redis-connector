export {};

declare global {
  export interface Promise<T> {
    timeout(ms: number, message: string): Promise<T>
  }
}