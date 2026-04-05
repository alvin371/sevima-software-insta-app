import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPosts } from "../services/profile.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.profile.posts(username),
    queryFn: ({ pageParam }) => getUserPosts(username, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!username,
  });
}
