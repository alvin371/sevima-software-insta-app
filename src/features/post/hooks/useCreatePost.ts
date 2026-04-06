import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../services/post.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { CursorPaginatedResponse } from "@/shared/types/api.types";
import type { CreatePostDto, Post, PostPreview, User } from "@/shared/types/models.types";

function prependToFirstPage<T extends { id: string }>(
  old:
    | InfiniteData<CursorPaginatedResponse<T>, string | undefined>
    | undefined,
  item: T,
) {
  if (!old) return old;

  const firstPage = old.pages[0];
  if (!firstPage) return old;
  if (old.pages.some((page) => page.data.some((existing) => existing.id === item.id))) {
    return old;
  }

  return {
    ...old,
    pages: [
      {
        ...firstPage,
        data: [item, ...firstPage.data],
      },
      ...old.pages.slice(1),
    ],
  };
}

function toPostPreview(post: Post): PostPreview {
  return {
    id: post.id,
    media: post.media,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
  };
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: (dto: CreatePostDto) => createPost(dto),
    onSuccess: (post: Post) => {
      const profileUsername = currentUser?.username ?? post.author.username;

      queryClient.setQueryData(queryKeys.posts.detail(post.id), post);
      queryClient.setQueryData<
        InfiniteData<CursorPaginatedResponse<Post>, string | undefined> | undefined
      >(queryKeys.feed.list(), (old) => prependToFirstPage(old, post));
      queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });

      if (profileUsername) {
        queryClient.setQueryData<
          InfiniteData<CursorPaginatedResponse<PostPreview>, string | undefined> | undefined
        >(queryKeys.profile.posts(profileUsername), (old) =>
          prependToFirstPage(old, toPostPreview(post)),
        );
        queryClient.setQueryData<User | undefined>(
          queryKeys.profile.detail(profileUsername),
          (old) => (old ? { ...old, postsCount: old.postsCount + 1 } : old),
        );
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            postsCount: currentUser.postsCount + 1,
          });
        }
        queryClient.invalidateQueries({
          queryKey: queryKeys.profile.posts(profileUsername),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.profile.detail(profileUsername),
        });
      }
    },
  });
}
