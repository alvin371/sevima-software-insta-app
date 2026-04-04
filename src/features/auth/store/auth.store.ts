import { create } from "zustand";
import type { User } from "@/shared/types/models.types";
import { tokenStorage } from "../utils/tokenStorage";

interface AuthState {
  // State
  accessToken: string | null;
  refreshToken: string | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  /**
   * True once MMKV tokens have been read on cold start.
   * Gates the root navigator — prevents a flash of the auth screen
   * while storage is being read.
   */
  isHydrated: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setCurrentUser: (user: User) => void;
  clearAuth: () => void;
  /**
   * Call once on app mount (synchronous — MMKV reads are sync).
   * Reads persisted tokens from MMKV and populates the store.
   */
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  refreshToken: null,
  currentUser: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrateFromStorage: () => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();
    set({
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken && !!refreshToken,
      isHydrated: true,
    });
  },

  setTokens: (accessToken, refreshToken) => {
    tokenStorage.setTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setCurrentUser: (user) => {
    tokenStorage.setUserId(user.id);
    set({ currentUser: user });
  },

  clearAuth: () => {
    tokenStorage.clearAll();
    set({
      accessToken: null,
      refreshToken: null,
      currentUser: null,
      isAuthenticated: false,
    });
  },
}));
