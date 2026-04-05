import type { Post, PostPreview, User, UserPreview } from "@/shared/types/models.types";

const previewUsers: UserPreview[] = [
  {
    id: "preview_u_1",
    username: "alvin",
    fullName: "Alvin Rahmat",
    avatarUrl: "https://i.pravatar.cc/300?img=12",
    isVerified: false,
  },
  {
    id: "preview_u_2",
    username: "naya.frames",
    fullName: "Naya Putri",
    avatarUrl: "https://i.pravatar.cc/300?img=25",
    isVerified: true,
  },
  {
    id: "preview_u_3",
    username: "rio.builds",
    fullName: "Rio Saputra",
    avatarUrl: "https://i.pravatar.cc/300?img=33",
    isVerified: false,
  },
  {
    id: "preview_u_4",
    username: "sora.journal",
    fullName: "Sora Mahendra",
    avatarUrl: "https://i.pravatar.cc/300?img=47",
    isVerified: false,
  },
] as const;

const previewImageSets = [
  {
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    width: 1080,
    height: 1350,
    caption: "Morning light across the apartment before the city got loud.",
    location: "Jakarta",
  },
  {
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    width: 1080,
    height: 1080,
    caption: "Palette test for the next product pass.",
    location: "Bandung",
  },
  {
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    width: 1080,
    height: 1440,
    caption: "Street portrait from a very fast walk between coffee stops.",
    location: "Yogyakarta",
  },
  {
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    width: 1440,
    height: 1080,
    caption: "Shipping a cleaner build with fewer moving parts.",
    location: "Surabaya",
  },
  {
    url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    width: 1080,
    height: 1350,
    caption: "Fabric study for a campaign that still needs a better name.",
    location: "Bali",
  },
  {
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    width: 1080,
    height: 1350,
    caption: "Quiet styling notes and a sharper silhouette.",
    location: "Semarang",
  },
  {
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    width: 1440,
    height: 1080,
    caption: "Three tabs open, one clear decision made.",
    location: "Jakarta",
  },
  {
    url: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80",
    width: 1080,
    height: 1350,
    caption: "Sunset tones over concrete and wet pavement.",
    location: "Bandung",
  },
] as const;

const previewDates = [
  "2026-04-05T02:15:00.000Z",
  "2026-04-04T18:25:00.000Z",
  "2026-04-04T12:40:00.000Z",
  "2026-04-04T07:05:00.000Z",
  "2026-04-03T22:15:00.000Z",
  "2026-04-03T15:00:00.000Z",
  "2026-04-03T08:10:00.000Z",
  "2026-04-02T20:45:00.000Z",
  "2026-04-02T13:30:00.000Z",
  "2026-04-02T06:20:00.000Z",
  "2026-04-01T23:00:00.000Z",
  "2026-04-01T17:15:00.000Z",
] as const;

export const PREVIEW_ENABLED = __DEV__;
export const PREVIEW_FEED_PAGE_SIZE = 4;
export const PREVIEW_GRID_PAGE_SIZE = 12;

function buildPost(index: number, authorOverride?: UserPreview): Post {
  const author = authorOverride ?? previewUsers[index % previewUsers.length];
  const image = previewImageSets[index % previewImageSets.length];
  const createdAt = previewDates[index % previewDates.length];

  return {
    id: `preview_p_${index + 1}`,
    author,
    media: [
      {
        id: `preview_m_${index + 1}`,
        url: image.url,
        thumbnailUrl: image.url,
        type: "image",
        width: image.width,
        height: image.height,
      },
    ],
    caption: `${image.caption} Set ${index + 1}.`,
    location: image.location,
    likesCount: 48 + index * 17,
    commentsCount: 3 + (index % 6) * 4,
    isLikedByMe: index % 3 === 0,
    isSavedByMe: index % 5 === 0,
    taggedUsers: previewUsers.filter((user) => user.id !== author.id).slice(0, index % 2),
    createdAt,
    updatedAt: createdAt,
  };
}

export const previewFeedPosts: Post[] = Array.from({ length: 24 }, (_, index) => buildPost(index));

const profilePreviewFeedPosts: Post[] = Array.from({ length: 15 }, (_, index) =>
  buildPost(index + 100, previewUsers[0]),
);

export const previewExplorePosts: PostPreview[] = [...previewFeedPosts, ...profilePreviewFeedPosts]
  .sort((left, right) => right.likesCount - left.likesCount)
  .map(({ id, media, likesCount, commentsCount }) => ({
    id,
    media,
    likesCount,
    commentsCount,
  }));

export const previewProfile: User = {
  id: previewUsers[0].id,
  username: previewUsers[0].username,
  fullName: "Alvin Rahmat",
  email: "alvin@instaapp.dev",
  avatarUrl: previewUsers[0].avatarUrl,
  bio: "Building flows, fixing rough edges, and checking the UI with production-like content.",
  website: "https://instaapp.dev/preview",
  isPrivate: false,
  isVerified: false,
  followersCount: 1824,
  followingCount: 318,
  postsCount: 15,
  isFollowedByMe: false,
  isFollowingMe: false,
  createdAt: "2026-01-07T10:00:00.000Z",
};

export const previewProfilePosts: PostPreview[] = previewFeedPosts
  .concat(profilePreviewFeedPosts)
  .filter((post) => post.author.id === previewProfile.id)
  .map(({ id, media, likesCount, commentsCount }) => ({
    id,
    media,
    likesCount,
    commentsCount,
  }));
