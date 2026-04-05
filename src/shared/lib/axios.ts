import axios, {
  AxiosAdapter,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { ApiError, AuthTokens } from "@/shared/types/api.types";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { mockApiAdapter } from "./mockApi";

const isMockApiMode =
  process.env.EXPO_PUBLIC_API_MODE === "mock" || !process.env.EXPO_PUBLIC_API_URL;

const adapter: AxiosAdapter | undefined = isMockApiMode ? mockApiAdapter : undefined;

// ─── Instance ─────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "mock://local",
  timeout: 15_000,
  adapter,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request interceptor — attach access token ─────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── 401 refresh-retry queue ──────────────────────────────────────────────────

let isRefreshing = false;
let pendingQueue: {
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}[] = [];

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

    const refreshToken = useAuthStore.getState().refreshToken;

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
      const refreshClient =
        adapter != null
          ? axios.create({
              baseURL: process.env.EXPO_PUBLIC_API_URL ?? "mock://local",
              adapter,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
          : axios;

      const { data } = await refreshClient.post<{ tokens: AuthTokens }>(
        `${process.env.EXPO_PUBLIC_API_URL ?? "mock://local"}${ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken },
      );

      const { accessToken, refreshToken: newRefreshToken } = data.tokens;

      useAuthStore.getState().setTokens(accessToken, newRefreshToken);

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
  useAuthStore.getState().clearAuth();
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
