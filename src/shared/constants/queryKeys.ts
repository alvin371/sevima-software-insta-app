export const queryKeys = {
  feed: {
    all: ["feed"] as const,
    list: (filters?: Record<string, unknown>) => ["feed", "list", filters] as const,
  },
  posts: {
    all: ["posts"] as const,
    detail: (id: string) => ["posts", "detail", id] as const,
    comments: (id: string) => ["posts", id, "comments"] as const,
    likes: (id: string) => ["posts", id, "likes"] as const,
  },
  profile: {
    all: ["profile"] as const,
    detail: (username: string) => ["profile", username] as const,
    posts: (username: string) => ["profile", username, "posts"] as const,
    followers: (username: string) => ["profile", username, "followers"] as const,
    following: (username: string) => ["profile", username, "following"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: () => ["notifications", "list"] as const,
  },
  search: {
    all: ["search"] as const,
    results: (query: string) => ["search", "results", query] as const,
    explore: () => ["search", "explore"] as const,
  },
  auth: {
    me: () => ["auth", "me"] as const,
  },
} as const;
