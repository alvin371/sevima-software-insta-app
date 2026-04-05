import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => addComment(postId, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
    },
  });
}
