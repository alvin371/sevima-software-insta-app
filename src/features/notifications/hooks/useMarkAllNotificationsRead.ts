import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllRead } from "../services/notifications.service";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { CursorPaginatedResponse } from "@/shared/types/api.types";
import type { Notification } from "@/shared/types/models.types";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list() });

      const previousNotifications = queryClient.getQueryData<
        InfiniteData<CursorPaginatedResponse<Notification>, string | undefined>
      >(queryKeys.notifications.list());

      queryClient.setQueryData<
        InfiniteData<CursorPaginatedResponse<Notification>, string | undefined>
      >(queryKeys.notifications.list(), (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((notification) => ({ ...notification, isRead: true })),
          })),
        };
      });

      return { previousNotifications };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications.list(), context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() });
    },
  });
}
