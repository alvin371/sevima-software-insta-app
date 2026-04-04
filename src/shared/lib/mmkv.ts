import { MMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

// Main storage instance used across the app
export const storage = new MMKV({ id: "instaapp-storage" });

// Auth-specific storage instance (isolated namespace)
export const authStorage = new MMKV({ id: "instaapp-auth" });

/**
 * Zustand-compatible StateStorage adapter backed by MMKV.
 * Pass this to Zustand's `persist` middleware as the `storage` option.
 */
export const zustandMMKVStorage: StateStorage = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};
