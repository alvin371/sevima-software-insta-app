import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { Post } from "@/shared/types/models.types";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) =>
      isLiked ? unlikePost(postId) : likePost(postId),

    // Optimistic update — update cache immediately before server responds
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) });

      const previousPost = queryClient.getQueryData<Post>(queryKeys.posts.detail(postId));

      queryClient.setQueryData<Post>(queryKeys.posts.detail(postId), (old) => {
        if (!old) return old;
        return {
          ...old,
          isLikedByMe: !isLiked,
          likesCount: isLiked ? old.likesCount - 1 : old.likesCount + 1,
        };
      });

      return { previousPost };
    },

    // Roll back on error
    onError: (_err, { postId }, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(queryKeys.posts.detail(postId), context.previousPost);
      }
    },

    // Always refetch after error or success
    onSettled: (_data, _err, { postId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
    },
  });
}
