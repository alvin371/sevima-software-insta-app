import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/notifications.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: ({ pageParam }) => getNotifications(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
