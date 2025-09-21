export {};

declare global {
  interface Window {
    xTracky: {
      track: (eventName: string, params?: Record<string, any>) => void;
    };
  }
}
