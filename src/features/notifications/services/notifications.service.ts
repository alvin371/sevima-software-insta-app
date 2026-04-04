import { apiClient } from "@/shared/lib/axios";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { CursorPaginatedResponse } from "@/shared/types/api.types";
import type { Notification } from "@/shared/types/models.types";

export async function getNotifications(cursor?: string): Promise<CursorPaginatedResponse<Notification>> {
  const { data } = await apiClient.get<CursorPaginatedResponse<Notification>>(
    ENDPOINTS.NOTIFICATIONS.LIST,
    { params: { cursor, limit: 20 } },
  );
  return data;
}

export async function markAllRead(): Promise<void> {
  await apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
}
