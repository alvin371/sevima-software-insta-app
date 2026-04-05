declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_MODE?: "mock" | "remote";
      EXPO_PUBLIC_API_URL?: string;
    }
  }
}

export {};
