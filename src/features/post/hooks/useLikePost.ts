import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { Post } from "@/shared/types/models.types";
import type { CursorPaginatedResponse } from "@/shared/types/api.types";

function updatePostInFeedPages(
  old: InfiniteData<CursorPaginatedResponse<Post>, string | undefined> | undefined,
  postId: string,
  isLiked: boolean,
) {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLikedByMe: !isLiked,
              likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
            }
          : post,
      ),
    })),
  };
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) =>
      isLiked ? unlikePost(postId) : likePost(postId),

    // Optimistic update — update cache immediately before server responds
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.feed.all });

      const previousPost = queryClient.getQueryData<Post>(queryKeys.posts.detail(postId));
      const previousFeed = queryClient.getQueryData<
        InfiniteData<CursorPaginatedResponse<Post>, string | undefined>
      >(queryKeys.feed.all);

      queryClient.setQueryData<Post>(queryKeys.posts.detail(postId), (old) => {
        if (!old) return old;
        return {
          ...old,
          isLikedByMe: !isLiked,
          likesCount: isLiked ? old.likesCount - 1 : old.likesCount + 1,
        };
      });
      queryClient.setQueryData<
        InfiniteData<CursorPaginatedResponse<Post>, string | undefined>
      >(queryKeys.feed.all, (old) => updatePostInFeedPages(old, postId, isLiked));

      return { previousPost, previousFeed };
    },

    // Roll back on error
    onError: (_err, { postId }, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(queryKeys.posts.detail(postId), context.previousPost);
      }
      if (context?.previousFeed) {
        queryClient.setQueryData(queryKeys.feed.all, context.previousFeed);
      }
    },

    // Always refetch after error or success
    onSettled: (_data, _err, { postId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
    },
  });
}
