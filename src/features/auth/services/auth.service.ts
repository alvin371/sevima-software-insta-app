import { apiClient } from "@/shared/lib/axios";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { AuthResponse } from "@/shared/types/api.types";
import type { LoginDto, RegisterDto } from "@/shared/types/models.types";

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, dto);
  return data;
}

export async function register(dto: RegisterDto): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, dto);
  return data;
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
}

export async function getMe() {
  const { data } = await apiClient.get<{ data: import("@/shared/types/models.types").User }>(
    ENDPOINTS.AUTH.ME,
  );
  return data.data;
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
}
