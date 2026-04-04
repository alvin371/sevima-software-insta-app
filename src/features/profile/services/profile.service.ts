import { apiClient } from "@/shared/lib/axios";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { ApiResponse, CursorPaginatedResponse } from "@/shared/types/api.types";
import type { User, PostPreview, UpdateProfileDto } from "@/shared/types/models.types";

export async function getProfile(username: string): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>(ENDPOINTS.USERS.PROFILE(username));
  return data.data;
}

export async function getUserPosts(username: string, cursor?: string): Promise<CursorPaginatedResponse<PostPreview>> {
  const { data } = await apiClient.get<CursorPaginatedResponse<PostPreview>>(
    ENDPOINTS.USERS.POSTS(username),
    { params: { cursor, limit: 18 } },
  );
  return data;
}

export async function followUser(username: string): Promise<void> {
  await apiClient.post(ENDPOINTS.USERS.FOLLOW(username));
}

export async function unfollowUser(username: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.USERS.UNFOLLOW(username));
}

export async function updateProfile(dto: UpdateProfileDto): Promise<User> {
  const { data } = await apiClient.patch<ApiResponse<User>>(ENDPOINTS.USERS.UPDATE_PROFILE, dto);
  return data.data;
}
