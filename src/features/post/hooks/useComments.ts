import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";
import { getPreviewCommentsByPostId, isPreviewPostId } from "@/shared/mocks/screenPreview";

export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.comments(postId),
    queryFn: async ({ pageParam }) => {
      if (isPreviewPostId(postId)) {
        return {
          data: getPreviewCommentsByPostId(postId),
          nextCursor: null,
          hasNextPage: false,
        };
      }

      return getComments(postId, pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!postId,
  });
}
