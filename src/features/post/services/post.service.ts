import { apiClient } from "@/shared/lib/axios";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { ApiResponse, CursorPaginatedResponse } from "@/shared/types/api.types";
import type {
  Post,
  Comment,
  AddCommentDto,
  CreatePostDto,
  UpdateCommentDto,
} from "@/shared/types/models.types";

export async function getPost(id: string): Promise<Post> {
  const { data } = await apiClient.get<ApiResponse<Post>>(ENDPOINTS.POSTS.DETAIL(id));
  return data.data;
}

export async function createPost(dto: CreatePostDto): Promise<Post> {
  const { data } = await apiClient.post<ApiResponse<Post>>(ENDPOINTS.POSTS.CREATE, dto);
  return data.data;
}

export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.POSTS.DELETE(id));
}

export async function likePost(id: string): Promise<void> {
  await apiClient.post(ENDPOINTS.POSTS.LIKE(id));
}

export async function unlikePost(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.POSTS.UNLIKE(id));
}

export async function getComments(postId: string, cursor?: string): Promise<CursorPaginatedResponse<Comment>> {
  const { data } = await apiClient.get<CursorPaginatedResponse<Comment>>(
    ENDPOINTS.POSTS.COMMENTS(postId),
    { params: { cursor, limit: 20 } },
  );
  return data;
}

export async function addComment(postId: string, dto: AddCommentDto): Promise<Comment> {
  const { data } = await apiClient.post<ApiResponse<Comment>>(
    ENDPOINTS.COMMENTS.CREATE(postId),
    dto,
  );
  return data.data;
}

export async function updateComment(
  postId: string,
  commentId: string,
  dto: UpdateCommentDto,
): Promise<Comment> {
  const { data } = await apiClient.patch<ApiResponse<Comment>>(
    ENDPOINTS.COMMENTS.UPDATE(postId, commentId),
    dto,
  );
  return data.data;
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.COMMENTS.DELETE(postId, commentId));
}

export async function likeComment(postId: string, commentId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.COMMENTS.LIKE(postId, commentId));
}

export async function unlikeComment(postId: string, commentId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.COMMENTS.UNLIKE(postId, commentId));
}
