import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../services/post.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useDeletePost() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (_data, postId) => {
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });

      if (currentUser?.username) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.profile.posts(currentUser.username),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.profile.detail(currentUser.username),
        });
      }
    },
  });
}
