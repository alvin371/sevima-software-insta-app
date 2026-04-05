// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  isPrivate: boolean;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowedByMe?: boolean;
  isFollowingMe?: boolean;
  createdAt: string;
}

export type UserPreview = Pick<User, "id" | "username" | "fullName" | "avatarUrl" | "isVerified">;

// ─── Post ─────────────────────────────────────────────────────────────────────

export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  width: number;
  height: number;
  duration?: number; // seconds, for video
}

export interface Post {
  id: string;
  author: UserPreview;
  media: MediaItem[];
  caption: string | null;
  location: string | null;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  taggedUsers: UserPreview[];
  createdAt: string;
  updatedAt: string;
}

export type PostPreview = Pick<Post, "id" | "media" | "likesCount" | "commentsCount">;

// ─── Comment ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  postId: string;
  author: UserPreview;
  text: string;
  likesCount: number;
  isLikedByMe: boolean;
  replies?: Comment[];
  repliesCount: number;
  parentId: string | null;
  createdAt: string;
}

// ─── Like ─────────────────────────────────────────────────────────────────────

export interface Like {
  id: string;
  user: UserPreview;
  targetType: "post" | "comment";
  targetId: string;
  createdAt: string;
}

// ─── Story ────────────────────────────────────────────────────────────────────

export interface Story {
  id: string;
  author: UserPreview;
  media: MediaItem;
  viewedByMe: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface StoryGroup {
  user: UserPreview;
  stories: Story[];
  hasUnviewed: boolean;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | "like_post"
  | "like_comment"
  | "comment"
  | "follow"
  | "follow_request"
  | "mention_post"
  | "mention_comment"
  | "tag_post";

export interface Notification {
  id: string;
  type: NotificationType;
  actor: UserPreview;
  post?: PostPreview;
  comment?: Pick<Comment, "id" | "text">;
  isRead: boolean;
  createdAt: string;
}

// ─── DTOs (request bodies) ────────────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface CreatePostDto {
  mediaUris: string[];
  caption?: string;
  location?: string;
  taggedUserIds?: string[];
}

export interface CreatePostDraft {
  uri: string;
  width: number;
  height: number;
  mimeType?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  caption?: string;
  location?: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  username?: string;
  bio?: string;
  website?: string;
  isPrivate?: boolean;
}

export interface AddCommentDto {
  text: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  text: string;
}
