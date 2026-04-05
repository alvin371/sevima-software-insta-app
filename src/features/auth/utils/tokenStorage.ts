import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/shared/constants/storage";

export const tokenStorage = {
  getAccessToken: async (): Promise<string | null> =>
    SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),

  getRefreshToken: async (): Promise<string | null> =>
    SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),

  getUserId: async (): Promise<string | null> =>
    SecureStore.getItemAsync(STORAGE_KEYS.USER_ID),

  setTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  },

  setUserId: async (userId: string): Promise<void> => {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, userId);
  },

  clearAll: async (): Promise<void> => {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_ID),
    ]);
  },

  hasTokens: async (): Promise<boolean> => {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
    ]);

    return Boolean(accessToken && refreshToken);
  },
};
