import { authStorage } from "@/shared/lib/mmkv";
import { STORAGE_KEYS } from "@/shared/constants/storage";

export const tokenStorage = {
  getAccessToken: (): string | null =>
    authStorage.getString(STORAGE_KEYS.ACCESS_TOKEN) ?? null,

  getRefreshToken: (): string | null =>
    authStorage.getString(STORAGE_KEYS.REFRESH_TOKEN) ?? null,

  getUserId: (): string | null =>
    authStorage.getString(STORAGE_KEYS.USER_ID) ?? null,

  setTokens: (accessToken: string, refreshToken: string): void => {
    authStorage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    authStorage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  setUserId: (userId: string): void => {
    authStorage.set(STORAGE_KEYS.USER_ID, userId);
  },

  clearAll: (): void => {
    authStorage.delete(STORAGE_KEYS.ACCESS_TOKEN);
    authStorage.delete(STORAGE_KEYS.REFRESH_TOKEN);
    authStorage.delete(STORAGE_KEYS.USER_ID);
  },

  hasTokens: (): boolean => {
    return (
      authStorage.contains(STORAGE_KEYS.ACCESS_TOKEN) &&
      authStorage.contains(STORAGE_KEYS.REFRESH_TOKEN)
    );
  },
};
