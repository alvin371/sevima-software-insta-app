import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
    },
  });
}
