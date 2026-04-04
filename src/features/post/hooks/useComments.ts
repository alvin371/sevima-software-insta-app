import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.comments(postId),
    queryFn: ({ pageParam }) => getComments(postId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!postId,
  });
}
