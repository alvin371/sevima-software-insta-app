import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { authStorage } from "./mmkv";
import { STORAGE_KEYS } from "@/shared/constants/storage";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { ApiError, AuthTokens } from "@/shared/types/api.types";

// ─── Instance ─────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request interceptor — attach access token ─────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStorage.getString(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── 401 refresh-retry queue ──────────────────────────────────────────────────

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

function flushQueue(token: string | null, error: unknown = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

// ─── Response interceptor — handle 401 / token refresh ───────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retried?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retried) {
      return Promise.reject(normalizeError(error));
    }

    const refreshToken = authStorage.getString(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      clearAuthStorage();
      return Promise.reject(normalizeError(error));
    }

    if (isRefreshing) {
      // Queue this request until the refresh resolves
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        }
        originalRequest._retried = true;
        return apiClient(originalRequest);
      });
    }

    isRefreshing = true;
    originalRequest._retried = true;

    try {
      const { data } = await axios.post<{ tokens: AuthTokens }>(
        `${process.env.EXPO_PUBLIC_API_URL}${ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken },
      );

      const { accessToken, refreshToken: newRefreshToken } = data.tokens;

      authStorage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      authStorage.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

      apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      flushQueue(accessToken);

      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      flushQueue(null, refreshError);
      clearAuthStorage();
      return Promise.reject(normalizeError(error));
    } finally {
      isRefreshing = false;
    }
  },
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clearAuthStorage() {
  authStorage.delete(STORAGE_KEYS.ACCESS_TOKEN);
  authStorage.delete(STORAGE_KEYS.REFRESH_TOKEN);
  authStorage.delete(STORAGE_KEYS.USER_ID);
}

function normalizeError(error: AxiosError<ApiError>): ApiError {
  if (error.response?.data) {
    return error.response.data;
  }
  return {
    message: error.message || "An unexpected error occurred",
    code: "NETWORK_ERROR",
    statusCode: error.response?.status ?? 0,
  };
}
