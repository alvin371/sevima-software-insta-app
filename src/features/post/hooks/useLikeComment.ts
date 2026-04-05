import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { likeComment, unlikeComment } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { CursorPaginatedResponse } from "@/shared/types/api.types";
import type { Comment } from "@/shared/types/models.types";

function isComment(value: unknown): value is Comment {
  return typeof value === "object" && value !== null && "id" in value && "author" in value;
}

function updateCommentTree(comments: Comment[], commentId: string, isLiked: boolean): Comment[] {
  return comments.flatMap((comment) => {
    if (!isComment(comment)) return [];

    const updatedReplies = comment.replies
      ? updateCommentTree(comment.replies, commentId, isLiked)
      : undefined;

    if (comment.id !== commentId) {
      return updatedReplies === comment.replies ? [comment] : [{ ...comment, replies: updatedReplies }];
    }

    return [{
      ...comment,
      isLikedByMe: !isLiked,
      likesCount: isLiked ? Math.max(comment.likesCount - 1, 0) : comment.likesCount + 1,
      replies: updatedReplies,
    }];
  });
}

function updateCommentPages(
  old: InfiniteData<CursorPaginatedResponse<Comment>, string | undefined> | undefined,
  commentId: string,
  isLiked: boolean,
) {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: updateCommentTree(page.data, commentId, isLiked),
    })),
  };
}

export function useLikeComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, isLiked }: { commentId: string; isLiked: boolean }) =>
      isLiked ? unlikeComment(postId, commentId) : likeComment(postId, commentId),
    onMutate: async ({ commentId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.comments(postId) });

      const previousComments = queryClient.getQueryData<
        InfiniteData<CursorPaginatedResponse<Comment>, string | undefined>
      >(queryKeys.posts.comments(postId));

      queryClient.setQueryData<
        InfiniteData<CursorPaginatedResponse<Comment>, string | undefined>
      >(queryKeys.posts.comments(postId), (old) => updateCommentPages(old, commentId, isLiked));

      return { previousComments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKeys.posts.comments(postId), context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
    },
  });
}
