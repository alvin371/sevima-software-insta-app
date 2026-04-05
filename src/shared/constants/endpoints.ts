export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  // Feed
  FEED: {
    LIST: "/feed",
  },
  // Posts
  POSTS: {
    LIST: "/posts",
    DETAIL: (id: string) => `/posts/${id}`,
    CREATE: "/posts",
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    UNLIKE: (id: string) => `/posts/${id}/like`,
    COMMENTS: (id: string) => `/posts/${id}/comments`,
    LIKES: (id: string) => `/posts/${id}/likes`,
  },
  // Comments
  COMMENTS: {
    CREATE: (postId: string) => `/posts/${postId}/comments`,
    UPDATE: (postId: string, commentId: string) =>
      `/posts/${postId}/comments/${commentId}`,
    DELETE: (postId: string, commentId: string) =>
      `/posts/${postId}/comments/${commentId}`,
    LIKE: (postId: string, commentId: string) =>
      `/posts/${postId}/comments/${commentId}/like`,
    UNLIKE: (postId: string, commentId: string) =>
      `/posts/${postId}/comments/${commentId}/like`,
  },
  // Profile / Users
  USERS: {
    PROFILE: (username: string) => `/users/${username}`,
    POSTS: (username: string) => `/users/${username}/posts`,
    FOLLOWERS: (username: string) => `/users/${username}/followers`,
    FOLLOWING: (username: string) => `/users/${username}/following`,
    FOLLOW: (username: string) => `/users/${username}/follow`,
    UNFOLLOW: (username: string) => `/users/${username}/follow`,
    UPDATE_PROFILE: "/users/me",
    UPLOAD_AVATAR: "/users/me/avatar",
  },
  // Search
  SEARCH: {
    QUERY: "/search",
    EXPLORE: "/search/explore",
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
  },
  // Media upload
  UPLOAD: {
    IMAGE: "/upload/image",
    VIDEO: "/upload/video",
  },
} as const;
