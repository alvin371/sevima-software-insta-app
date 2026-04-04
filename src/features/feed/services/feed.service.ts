import { apiClient } from "@/shared/lib/axios";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { CursorPaginatedResponse } from "@/shared/types/api.types";
import type { Post } from "@/shared/types/models.types";

export async function getFeed(cursor?: string): Promise<CursorPaginatedResponse<Post>> {
  const { data } = await apiClient.get<CursorPaginatedResponse<Post>>(ENDPOINTS.FEED.LIST, {
    params: { cursor, limit: 12 },
  });
  return data;
}
