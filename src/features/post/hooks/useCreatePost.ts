import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../services/post.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { CreatePostDto, Post } from "@/shared/types/models.types";

export function useCreatePost() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);

  return useMutation({
    mutationFn: (dto: CreatePostDto) => createPost(dto),
    onSuccess: (post: Post) => {
      queryClient.setQueryData(queryKeys.posts.detail(post.id), post);
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
