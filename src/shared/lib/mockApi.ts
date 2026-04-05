import { AxiosAdapter, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { STORAGE_KEYS } from "@/shared/constants/storage";
import { kv } from "./kv";
import type {
  ApiResponse,
  AuthResponse,
  AuthTokens,
  CursorPaginatedResponse,
} from "@/shared/types/api.types";
import type {
  AddCommentDto,
  Comment,
  CreatePostDto,
  MediaItem,
  Notification,
  Post,
  PostPreview,
  UpdateProfileDto,
  User,
  UserPreview,
} from "@/shared/types/models.types";

type SearchResults = {
  users: User[];
  posts: PostPreview[];
};

type MockSession = {
  refreshToken: string;
  userId: string;
  createdAt: string;
};

type MockUserRecord = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  isPrivate: boolean;
  isVerified: boolean;
  createdAt: string;
};

type MockPostRecord = {
  id: string;
  authorId: string;
  media: MediaItem[];
  caption: string | null;
  location: string | null;
  taggedUserIds: string[];
  likedBy: string[];
  savedBy: string[];
  createdAt: string;
  updatedAt: string;
};

type MockCommentRecord = {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  likedBy: string[];
  parentId: string | null;
  createdAt: string;
};

type MockFollowRecord = {
  followerId: string;
  followingId: string;
};

type MockNotificationRecord = {
  id: string;
  userId: string;
  type: Notification["type"];
  actorId: string;
  postId?: string;
  commentId?: string;
  isRead: boolean;
  createdAt: string;
};

type MockDb = {
  users: MockUserRecord[];
  posts: MockPostRecord[];
  comments: MockCommentRecord[];
  follows: MockFollowRecord[];
  notifications: MockNotificationRecord[];
  sessions: MockSession[];
};

const DEFAULT_LIMIT = 20;
const NETWORK_DELAY_MS = 120;

const mockUsers = [
  {
    id: "u_1",
    username: "alvin",
    fullName: "Alvin Hartono",
    email: "alvin@instaapp.dev",
    password: "password123",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    bio: "Collecting visual stories from Jakarta.",
    website: "https://instaapp.dev/alvin",
    isPrivate: false,
    isVerified: true,
    createdAt: "2026-03-01T09:00:00.000Z",
  },
  {
    id: "u_2",
    username: "maya",
    fullName: "Maya Rahma",
    email: "maya@instaapp.dev",
    password: "password123",
    avatarUrl: null,
    bio: "Street photos, coffee stops, and night markets.",
    website: null,
    isPrivate: false,
    isVerified: false,
    createdAt: "2026-03-02T08:15:00.000Z",
  },
  {
    id: "u_3",
    username: "rio",
    fullName: "Rio Saputra",
    email: "rio@instaapp.dev",
    password: "password123",
    avatarUrl: null,
    bio: "Designer building quiet interfaces.",
    website: "https://rio.design",
    isPrivate: false,
    isVerified: false,
    createdAt: "2026-03-03T12:00:00.000Z",
  },
] satisfies MockUserRecord[];

const mockPosts = [
  {
    id: "p_1",
    authorId: "u_2",
    media: [buildMedia("m_1", "https://images.unsplash.com/photo-1494790108377-be9c29b29330")],
    caption: "Soft light over the old town before the rain started.",
    location: "Bandung",
    taggedUserIds: ["u_1"],
    likedBy: ["u_1", "u_3"],
    savedBy: [],
    createdAt: "2026-04-04T04:30:00.000Z",
    updatedAt: "2026-04-04T04:30:00.000Z",
  },
  {
    id: "p_2",
    authorId: "u_3",
    media: [buildMedia("m_2", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee")],
    caption: "Wireframes are better when the desk is clean and the playlist is loud.",
    location: "Jakarta",
    taggedUserIds: [],
    likedBy: ["u_1"],
    savedBy: [],
    createdAt: "2026-04-03T09:00:00.000Z",
    updatedAt: "2026-04-03T09:00:00.000Z",
  },
  {
    id: "p_3",
    authorId: "u_1",
    media: [buildMedia("m_3", "https://images.unsplash.com/photo-1517841905240-472988babdf9")],
    caption: "Testing a mock backend before the real one lands.",
    location: "Jakarta",
    taggedUserIds: [],
    likedBy: ["u_2"],
    savedBy: [],
    createdAt: "2026-04-02T15:45:00.000Z",
    updatedAt: "2026-04-02T15:45:00.000Z",
  },
] satisfies MockPostRecord[];

const mockComments = [
  {
    id: "c_1",
    postId: "p_1",
    authorId: "u_1",
    text: "That color grade is excellent.",
    likedBy: ["u_2"],
    parentId: null,
    createdAt: "2026-04-04T05:00:00.000Z",
  },
  {
    id: "c_2",
    postId: "p_3",
    authorId: "u_2",
    text: "This is exactly the right move for demo speed.",
    likedBy: [],
    parentId: null,
    createdAt: "2026-04-02T16:00:00.000Z",
  },
] satisfies MockCommentRecord[];

const mockFollows = [
  { followerId: "u_1", followingId: "u_2" },
  { followerId: "u_1", followingId: "u_3" },
  { followerId: "u_2", followingId: "u_1" },
] satisfies MockFollowRecord[];

const mockNotifications = [
  {
    id: "n_1",
    userId: "u_1",
    type: "like_post",
    actorId: "u_2",
    postId: "p_3",
    isRead: false,
    createdAt: "2026-04-04T05:05:00.000Z",
  },
  {
    id: "n_2",
    userId: "u_1",
    type: "comment",
    actorId: "u_2",
    postId: "p_3",
    commentId: "c_2",
    isRead: false,
    createdAt: "2026-04-02T16:00:00.000Z",
  },
] satisfies MockNotificationRecord[];

function buildMedia(id: string, url: string): MediaItem {
  return {
    id,
    url,
    thumbnailUrl: url,
    type: "image",
    width: 1080,
    height: 1350,
  };
}

function buildInitialDb(): MockDb {
  return {
    users: [...mockUsers],
    posts: [...mockPosts],
    comments: [...mockComments],
    follows: [...mockFollows],
    notifications: [...mockNotifications],
    sessions: [],
  };
}

async function loadDb(): Promise<MockDb> {
  const raw = await kv.getString(STORAGE_KEYS.MOCK_DB);
  if (!raw) {
    const seeded = buildInitialDb();
    await saveDb(seeded);
    return seeded;
  }

  try {
    return JSON.parse(raw) as MockDb;
  } catch {
    const seeded = buildInitialDb();
    await saveDb(seeded);
    return seeded;
  }
}

async function saveDb(db: MockDb) {
  await kv.set(STORAGE_KEYS.MOCK_DB, JSON.stringify(db));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nowIso() {
  return new Date().toISOString();
}

function nextId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function getAuthorizationToken(config: InternalAxiosRequestConfig) {
  const headers =
    config.headers instanceof AxiosHeaders ? config.headers : AxiosHeaders.from(config.headers);
  const raw = headers.get("Authorization");
  if (!raw) return null;
  return String(raw).replace(/^Bearer\s+/i, "");
}

function getCurrentUserId(config: InternalAxiosRequestConfig, db: MockDb) {
  const token = getAuthorizationToken(config);
  if (!token?.startsWith("mock-access-")) return null;

  const userId = token.replace("mock-access-", "");
  return db.users.some((user) => user.id === userId) ? userId : null;
}

function requireAuth(config: InternalAxiosRequestConfig, db: MockDb) {
  const userId = getCurrentUserId(config, db);
  if (!userId) {
    throw buildApiError(401, "UNAUTHORIZED", "You need to sign in to continue.");
  }
  return userId;
}

function buildApiError(statusCode: number, code: string, message: string) {
  return {
    statusCode,
    code,
    message,
  };
}

function buildAuthTokens(userId: string): AuthTokens {
  return {
    accessToken: `mock-access-${userId}`,
    refreshToken: `mock-refresh-${nextId("session")}`,
    expiresIn: 60 * 60,
  };
}

function parseRequestBody<T>(config: InternalAxiosRequestConfig): T {
  if (!config.data) return {} as T;
  if (typeof config.data === "string") {
    return JSON.parse(config.data) as T;
  }
  return config.data as T;
}

function getParam(config: InternalAxiosRequestConfig, key: string) {
  const params = config.params as Record<string, string | number | undefined> | undefined;
  return params?.[key];
}

function paginate<T extends { id: string }>(
  items: T[],
  limit: number,
  cursor?: string | null,
): CursorPaginatedResponse<T> {
  const startIndex = cursor ? items.findIndex((item) => item.id === cursor) + 1 : 0;
  const data = items.slice(Math.max(startIndex, 0), Math.max(startIndex, 0) + limit);
  const nextCursor = data.length === limit ? (data[data.length - 1]?.id ?? null) : null;

  return {
    data,
    nextCursor,
    hasNextPage: Boolean(nextCursor),
  };
}

function userPreview(db: MockDb, userId: string): UserPreview {
  const user = db.users.find((item) => item.id === userId);
  if (!user) throw buildApiError(404, "USER_NOT_FOUND", "User not found.");

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    isVerified: user.isVerified,
  };
}

function userModel(db: MockDb, userId: string, viewerId?: string | null): User {
  const user = db.users.find((item) => item.id === userId);
  if (!user) throw buildApiError(404, "USER_NOT_FOUND", "User not found.");

  const followers = db.follows.filter((item) => item.followingId === user.id).length;
  const following = db.follows.filter((item) => item.followerId === user.id).length;
  const postsCount = db.posts.filter((item) => item.authorId === user.id).length;

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    website: user.website,
    isPrivate: user.isPrivate,
    isVerified: user.isVerified,
    followersCount: followers,
    followingCount: following,
    postsCount,
    isFollowedByMe: viewerId
      ? db.follows.some((item) => item.followerId === viewerId && item.followingId === user.id)
      : false,
    isFollowingMe: viewerId
      ? db.follows.some((item) => item.followerId === user.id && item.followingId === viewerId)
      : false,
    createdAt: user.createdAt,
  };
}

function postModel(db: MockDb, post: MockPostRecord, viewerId?: string | null): Post {
  return {
    id: post.id,
    author: userPreview(db, post.authorId),
    media: clone(post.media),
    caption: post.caption,
    location: post.location,
    likesCount: post.likedBy.length,
    commentsCount: db.comments.filter((item) => item.postId === post.id).length,
    isLikedByMe: viewerId ? post.likedBy.includes(viewerId) : false,
    isSavedByMe: viewerId ? post.savedBy.includes(viewerId) : false,
    taggedUsers: post.taggedUserIds.map((userId) => userPreview(db, userId)),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function postPreviewModel(db: MockDb, post: MockPostRecord, viewerId?: string | null): PostPreview {
  const model = postModel(db, post, viewerId);
  return {
    id: model.id,
    media: model.media,
    likesCount: model.likesCount,
    commentsCount: model.commentsCount,
  };
}

function commentModel(db: MockDb, comment: MockCommentRecord, viewerId?: string | null): Comment {
  const replies = db.comments
    .filter((item) => item.parentId === comment.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((item) => commentModel(db, item, viewerId));

  return {
    id: comment.id,
    postId: comment.postId,
    author: userPreview(db, comment.authorId),
    text: comment.text,
    likesCount: comment.likedBy.length,
    isLikedByMe: viewerId ? comment.likedBy.includes(viewerId) : false,
    replies: replies.length > 0 ? replies : undefined,
    repliesCount: replies.length,
    parentId: comment.parentId,
    createdAt: comment.createdAt,
  };
}

function notificationModel(
  db: MockDb,
  notification: MockNotificationRecord,
  viewerId?: string | null,
): Notification {
  const referencedPost = notification.postId
    ? db.posts.find((item) => item.id === notification.postId)
    : undefined;
  const referencedComment = notification.commentId
    ? db.comments.find((item) => item.id === notification.commentId)
    : undefined;

  return {
    id: notification.id,
    type: notification.type,
    actor: userPreview(db, notification.actorId),
    post: referencedPost ? postPreviewModel(db, referencedPost, viewerId) : undefined,
    comment: referencedComment
      ? { id: referencedComment.id, text: referencedComment.text }
      : undefined,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  };
}

function touchNotificationsForComment(
  db: MockDb,
  actorId: string,
  postId: string,
  commentId: string,
) {
  const post = db.posts.find((item) => item.id === postId);
  if (!post || post.authorId === actorId) return;

  db.notifications.unshift({
    id: nextId("n"),
    userId: post.authorId,
    type: "comment",
    actorId,
    postId,
    commentId,
    isRead: false,
    createdAt: nowIso(),
  });
}

function touchNotificationsForLike(db: MockDb, actorId: string, postId: string) {
  const post = db.posts.find((item) => item.id === postId);
  if (!post || post.authorId === actorId) return;

  db.notifications.unshift({
    id: nextId("n"),
    userId: post.authorId,
    type: "like_post",
    actorId,
    postId,
    isRead: false,
    createdAt: nowIso(),
  });
}

function touchNotificationsForFollow(db: MockDb, actorId: string, targetId: string) {
  if (actorId === targetId) return;

  db.notifications.unshift({
    id: nextId("n"),
    userId: targetId,
    type: "follow",
    actorId,
    isRead: false,
    createdAt: nowIso(),
  });
}

function ok<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> {
  return {
    config,
    data,
    status,
    statusText: "OK",
    headers: {},
  };
}

function fail(
  config: InternalAxiosRequestConfig,
  status: number,
  code: string,
  message: string,
): AxiosResponse<{ statusCode: number; code: string; message: string }> {
  return {
    config,
    data: buildApiError(status, code, message),
    status,
    statusText: "ERROR",
    headers: {},
  };
}

function methodOf(config: InternalAxiosRequestConfig) {
  return (config.method ?? "get").toUpperCase();
}

function limitOf(config: InternalAxiosRequestConfig) {
  const raw = Number(getParam(config, "limit") ?? DEFAULT_LIMIT);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_LIMIT;
}

function endpointOf(config: InternalAxiosRequestConfig) {
  const rawUrl = config.url ?? "/";
  const url = rawUrl.includes("://") ? new URL(rawUrl).pathname : rawUrl;
  return url.replace(/\/+$/, "") || "/";
}

function authResponse(db: MockDb, userId: string, tokens: AuthTokens): AuthResponse {
  db.sessions.push({
    refreshToken: tokens.refreshToken,
    userId,
    createdAt: nowIso(),
  });

  return {
    user: userModel(db, userId, userId),
    tokens,
  };
}

async function handleRequest(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const db = await loadDb();
  const endpoint = endpointOf(config);
  const method = methodOf(config);
  const viewerId = getCurrentUserId(config, db);

  try {
    if (endpoint === "/auth/login" && method === "POST") {
      const body = parseRequestBody<{ email: string; password: string }>(config);
      const loginValue = body.email.trim().toLowerCase();
      const user = db.users.find(
        (item) =>
          (item.email.toLowerCase() === loginValue || item.username.toLowerCase() === loginValue) &&
          item.password === body.password,
      );

      if (!user) {
        return fail(config, 401, "INVALID_CREDENTIALS", "Invalid email/username or password.");
      }

      const tokens = buildAuthTokens(user.id);
      const response = authResponse(db, user.id, tokens);
      await saveDb(db);
      return ok(config, response);
    }

    if (endpoint === "/auth/register" && method === "POST") {
      const body = parseRequestBody<{
        fullName: string;
        username: string;
        email: string;
        password: string;
      }>(config);
      const email = body.email.trim().toLowerCase();
      const username = body.username.trim().toLowerCase();

      if (db.users.some((item) => item.email.toLowerCase() === email)) {
        return fail(config, 409, "EMAIL_TAKEN", "That email is already registered.");
      }

      if (db.users.some((item) => item.username.toLowerCase() === username)) {
        return fail(config, 409, "USERNAME_TAKEN", "That username is already taken.");
      }

      const user: MockUserRecord = {
        id: nextId("u"),
        email,
        username,
        fullName: body.fullName.trim(),
        password: body.password,
        avatarUrl: null,
        bio: null,
        website: null,
        isPrivate: false,
        isVerified: false,
        createdAt: nowIso(),
      };

      db.users.unshift(user);
      const tokens = buildAuthTokens(user.id);
      const response = authResponse(db, user.id, tokens);
      await saveDb(db);
      return ok(config, response, 201);
    }

    if (endpoint === "/auth/logout" && method === "POST") {
      const body = parseRequestBody<{ refreshToken?: string }>(config);
      db.sessions = db.sessions.filter((item) => item.refreshToken !== body.refreshToken);
      await saveDb(db);
      return ok(config, { success: true });
    }

    if (endpoint === "/auth/refresh" && method === "POST") {
      const body = parseRequestBody<{ refreshToken?: string }>(config);
      const session = db.sessions.find((item) => item.refreshToken === body.refreshToken);

      if (!session) {
        return fail(config, 401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid.");
      }

      db.sessions = db.sessions.filter((item) => item.refreshToken !== body.refreshToken);
      const tokens = buildAuthTokens(session.userId);
      db.sessions.push({
        refreshToken: tokens.refreshToken,
        userId: session.userId,
        createdAt: nowIso(),
      });
      await saveDb(db);

      return ok(config, { tokens });
    }

    if (endpoint === "/auth/me" && method === "GET") {
      const userId = requireAuth(config, db);
      return ok(config, { data: userModel(db, userId, userId) });
    }

    if (endpoint === "/auth/forgot-password" && method === "POST") {
      return ok(config, { success: true });
    }

    if (endpoint === "/feed" && method === "GET") {
      const posts = [...db.posts]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((post) => postModel(db, post, viewerId));
      return ok(
        config,
        paginate(posts, limitOf(config), getParam(config, "cursor") as string | undefined),
      );
    }

    if (endpoint === "/posts" && method === "POST") {
      const userId = requireAuth(config, db);
      const body = parseRequestBody<CreatePostDto>(config);
      const timestamp = nowIso();
      const post: MockPostRecord = {
        id: nextId("p"),
        authorId: userId,
        media: (body.mediaUris ?? []).map((uri, index) => ({
          id: nextId(`m${index}`),
          url: uri,
          thumbnailUrl: uri,
          type: "image",
          width: 1080,
          height: 1350,
        })),
        caption: body.caption ?? null,
        location: body.location ?? null,
        taggedUserIds: body.taggedUserIds ?? [],
        likedBy: [],
        savedBy: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      db.posts.unshift(post);
      await saveDb(db);

      const response: ApiResponse<Post> = {
        success: true,
        data: postModel(db, post, userId),
      };
      return ok(config, response, 201);
    }

    if (endpoint === "/search" && method === "GET") {
      const rawQuery = String(getParam(config, "q") ?? "")
        .trim()
        .toLowerCase();
      const users = db.users
        .filter(
          (user) =>
            user.username.toLowerCase().includes(rawQuery) ||
            user.fullName.toLowerCase().includes(rawQuery),
        )
        .slice(0, 8)
        .map((user) => userModel(db, user.id, viewerId));
      const posts = db.posts
        .filter((post) => {
          const author = db.users.find((user) => user.id === post.authorId);
          return (
            (post.caption ?? "").toLowerCase().includes(rawQuery) ||
            (post.location ?? "").toLowerCase().includes(rawQuery) ||
            author?.username.toLowerCase().includes(rawQuery)
          );
        })
        .slice(0, 12)
        .map((post) => postPreviewModel(db, post, viewerId));

      const response: SearchResults = { users, posts };
      return ok(config, response);
    }

    if (endpoint === "/search/explore" && method === "GET") {
      const posts = [...db.posts]
        .sort(
          (a, b) => b.likedBy.length - a.likedBy.length || b.createdAt.localeCompare(a.createdAt),
        )
        .map((post) => postPreviewModel(db, post, viewerId));
      return ok(config, posts);
    }

    if (endpoint === "/notifications" && method === "GET") {
      const userId = requireAuth(config, db);
      const notifications = db.notifications
        .filter((item) => item.userId === userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((item) => notificationModel(db, item, userId));
      return ok(
        config,
        paginate(notifications, limitOf(config), getParam(config, "cursor") as string | undefined),
      );
    }

    if (endpoint === "/notifications/read-all" && method === "POST") {
      const userId = requireAuth(config, db);
      db.notifications = db.notifications.map((item) =>
        item.userId === userId ? { ...item, isRead: true } : item,
      );
      await saveDb(db);
      return ok(config, { success: true });
    }

    const postMatch = endpoint.match(/^\/posts\/([^/]+)$/);
    if (postMatch) {
      const postId = postMatch[1];
      const post = db.posts.find((item) => item.id === postId);
      if (!post) return fail(config, 404, "POST_NOT_FOUND", "Post not found.");

      if (method === "GET") {
        const response: ApiResponse<Post> = {
          success: true,
          data: postModel(db, post, viewerId),
        };
        return ok(config, response);
      }

      if (method === "DELETE") {
        const userId = requireAuth(config, db);
        if (post.authorId !== userId) {
          return fail(config, 403, "FORBIDDEN", "You can only delete your own posts.");
        }

        db.posts = db.posts.filter((item) => item.id !== postId);
        db.comments = db.comments.filter((item) => item.postId !== postId);
        db.notifications = db.notifications.filter((item) => item.postId !== postId);
        await saveDb(db);
        return ok(config, { success: true });
      }
    }

    const postLikeMatch = endpoint.match(/^\/posts\/([^/]+)\/like$/);
    if (postLikeMatch) {
      const userId = requireAuth(config, db);
      const post = db.posts.find((item) => item.id === postLikeMatch[1]);
      if (!post) return fail(config, 404, "POST_NOT_FOUND", "Post not found.");

      if (method === "POST") {
        if (!post.likedBy.includes(userId)) {
          post.likedBy.push(userId);
          touchNotificationsForLike(db, userId, post.id);
          await saveDb(db);
        }
        return ok(config, { success: true });
      }

      if (method === "DELETE") {
        post.likedBy = post.likedBy.filter((id) => id !== userId);
        await saveDb(db);
        return ok(config, { success: true });
      }
    }

    const commentsMatch = endpoint.match(/^\/posts\/([^/]+)\/comments$/);
    if (commentsMatch) {
      const postId = commentsMatch[1];
      const post = db.posts.find((item) => item.id === postId);
      if (!post) return fail(config, 404, "POST_NOT_FOUND", "Post not found.");

      if (method === "GET") {
        const comments = db.comments
          .filter((item) => item.postId === postId && item.parentId === null)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((item) => commentModel(db, item, viewerId));
        return ok(
          config,
          paginate(comments, limitOf(config), getParam(config, "cursor") as string | undefined),
        );
      }

      if (method === "POST") {
        const userId = requireAuth(config, db);
        const body = parseRequestBody<AddCommentDto>(config);
        const comment: MockCommentRecord = {
          id: nextId("c"),
          postId,
          authorId: userId,
          text: body.text.trim(),
          likedBy: [],
          parentId: body.parentId ?? null,
          createdAt: nowIso(),
        };

        db.comments.unshift(comment);
        touchNotificationsForComment(db, userId, postId, comment.id);
        await saveDb(db);

        const response: ApiResponse<Comment> = {
          success: true,
          data: commentModel(db, comment, userId),
        };
        return ok(config, response, 201);
      }
    }

    const deleteCommentMatch = endpoint.match(/^\/posts\/([^/]+)\/comments\/([^/]+)$/);
    if (deleteCommentMatch && method === "DELETE") {
      const userId = requireAuth(config, db);
      const postId = deleteCommentMatch[1];
      const commentId = deleteCommentMatch[2];
      const comment = db.comments.find((item) => item.id === commentId && item.postId === postId);

      if (!comment) return fail(config, 404, "COMMENT_NOT_FOUND", "Comment not found.");
      if (comment.authorId !== userId) {
        return fail(config, 403, "FORBIDDEN", "You can only delete your own comments.");
      }

      db.comments = db.comments.filter(
        (item) => item.id !== commentId && item.parentId !== commentId,
      );
      db.notifications = db.notifications.filter((item) => item.commentId !== commentId);
      await saveDb(db);
      return ok(config, { success: true });
    }

    const userMatch = endpoint.match(/^\/users\/([^/]+)$/);
    if (userMatch && method === "GET") {
      const user = db.users.find((item) => item.username === userMatch[1]);
      if (!user) return fail(config, 404, "USER_NOT_FOUND", "User not found.");

      const response: ApiResponse<User> = {
        success: true,
        data: userModel(db, user.id, viewerId),
      };
      return ok(config, response);
    }

    const userPostsMatch = endpoint.match(/^\/users\/([^/]+)\/posts$/);
    if (userPostsMatch && method === "GET") {
      const user = db.users.find((item) => item.username === userPostsMatch[1]);
      if (!user) return fail(config, 404, "USER_NOT_FOUND", "User not found.");

      const posts = db.posts
        .filter((item) => item.authorId === user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((post) => postPreviewModel(db, post, viewerId));
      return ok(
        config,
        paginate(posts, limitOf(config), getParam(config, "cursor") as string | undefined),
      );
    }

    const followMatch = endpoint.match(/^\/users\/([^/]+)\/follow$/);
    if (followMatch) {
      const userId = requireAuth(config, db);
      const target = db.users.find((item) => item.username === followMatch[1]);
      if (!target) return fail(config, 404, "USER_NOT_FOUND", "User not found.");

      if (method === "POST") {
        if (
          !db.follows.some((item) => item.followerId === userId && item.followingId === target.id)
        ) {
          db.follows.push({ followerId: userId, followingId: target.id });
          touchNotificationsForFollow(db, userId, target.id);
          await saveDb(db);
        }
        return ok(config, { success: true });
      }

      if (method === "DELETE") {
        db.follows = db.follows.filter(
          (item) => !(item.followerId === userId && item.followingId === target.id),
        );
        await saveDb(db);
        return ok(config, { success: true });
      }
    }

    if (endpoint === "/users/me" && method === "PATCH") {
      const userId = requireAuth(config, db);
      const body = parseRequestBody<UpdateProfileDto>(config);
      const user = db.users.find((item) => item.id === userId);
      if (!user) return fail(config, 404, "USER_NOT_FOUND", "User not found.");

      if (body.username) {
        const normalized = body.username.trim().toLowerCase();
        const usernameTaken = db.users.some(
          (item) => item.id !== user.id && item.username.toLowerCase() === normalized,
        );
        if (usernameTaken) {
          return fail(config, 409, "USERNAME_TAKEN", "That username is already taken.");
        }
        user.username = normalized;
      }

      if (typeof body.fullName === "string") user.fullName = body.fullName;
      if (typeof body.bio === "string") user.bio = body.bio;
      if (typeof body.website === "string") user.website = body.website;
      if (typeof body.isPrivate === "boolean") user.isPrivate = body.isPrivate;

      await saveDb(db);

      const response: ApiResponse<User> = {
        success: true,
        data: userModel(db, user.id, user.id),
      };
      return ok(config, response);
    }

    return fail(config, 404, "NOT_FOUND", `Mock endpoint not implemented: ${method} ${endpoint}`);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      "code" in error &&
      "message" in error
    ) {
      const apiError = error as { statusCode: number; code: string; message: string };
      return fail(config, apiError.statusCode, apiError.code, apiError.message);
    }

    return fail(config, 500, "MOCK_SERVER_ERROR", "Mock API failed to process the request.");
  }
}

export const mockApiAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
  return handleRequest(config);
};
