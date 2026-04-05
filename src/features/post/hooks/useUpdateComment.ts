import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      updateComment(postId, commentId, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
    },
  });
}
