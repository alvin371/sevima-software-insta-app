import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "../services/feed.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useFeed() {
  return useInfiniteQuery({
    queryKey: queryKeys.feed.list(),
    queryFn: ({ pageParam }) => getFeed(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
