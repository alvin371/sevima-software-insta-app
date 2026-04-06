import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, useWindowDimensions } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ParamListBase, RouteProp } from "@react-navigation/native";
import type { ProfileStackParamList } from "@/app/navigation/types";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMe } from "@/features/auth/hooks/useMe";
import { useProfile } from "../hooks/useProfile";
import { useUserPosts } from "../hooks/useUserPosts";
import { useRefreshOnFocus } from "@/shared/hooks/useRefreshOnFocus";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Avatar } from "@/shared/components/ui/Avatar";
import { PostGridTile } from "@/shared/components/post/PostGridTile";
import {
  PREVIEW_ENABLED,
  PREVIEW_GRID_PAGE_SIZE,
  previewProfile,
  previewProfilePosts,
} from "@/shared/mocks/screenPreview";

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route = useRoute<RouteProp<ParamListBase, string>>();
  const { width } = useWindowDimensions();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const meQuery = useMe();
  const routeUsername =
    route.params &&
    typeof route.params === "object" &&
    "username" in route.params &&
    typeof route.params.username === "string"
      ? route.params.username
      : undefined;
  const myUsername = currentUser?.username ?? meQuery.data?.username ?? "";
  const isOwnedProfileRoute = route.name === "Profile";
  const hasExplicitProfileOverride =
    isOwnedProfileRoute && !!routeUsername && routeUsername !== myUsername;
  const username = isOwnedProfileRoute
    ? hasExplicitProfileOverride
      ? routeUsername
      : myUsername
    : (routeUsername ?? myUsername);
  // Never show preview data when a real user is authenticated — PREVIEW_ENABLED only applies
  // to truly unauthenticated/standalone screen previews during UI development.
  const isPreviewMode = PREVIEW_ENABLED && !isAuthenticated;

  const profileQuery = useProfile(username);
  const postsQuery = useUserPosts(username);
  const [previewCount, setPreviewCount] = useState(PREVIEW_GRID_PAGE_SIZE);

  useRefreshOnFocus(() => {
    if (isPreviewMode) return;
    void profileQuery.refetch();
    void postsQuery.refetch();
  });

  useEffect(() => {
    if (!isPreviewMode) return;
    setPreviewCount(PREVIEW_GRID_PAGE_SIZE);
  }, [isPreviewMode]);

  if (!username && !isPreviewMode && !meQuery.isLoading) {
    return (
      <SafeScreen edges={["top"]}>
        <EmptyState
          title="Profile unavailable"
          description="Sign in to load your profile and cached posts."
        />
      </SafeScreen>
    );
  }

  if (
    !isPreviewMode &&
    (profileQuery.isLoading || (isOwnedProfileRoute && meQuery.isLoading && !username))
  ) {
    return (
      <SafeScreen edges={["top"]}>
        <LoadingSpinner fullScreen />
      </SafeScreen>
    );
  }

  if (!isPreviewMode && (profileQuery.isError || !profileQuery.data)) {
    return (
      <SafeScreen edges={["top"]}>
        <EmptyState
          title="Could not load profile"
          description="Pull to refresh or open the screen again once the API is available."
          actionLabel="Retry"
          onAction={() => {
            void profileQuery.refetch();
          }}
        />
      </SafeScreen>
    );
  }

  const profile = isPreviewMode ? previewProfile : profileQuery.data!;
  const posts = isPreviewMode
    ? previewProfilePosts.slice(0, previewCount)
    : (postsQuery.data?.pages.flatMap((page) => page.data) ?? []);
  const tileSize = Math.floor((width - 40) / 3);
  const hasMorePreview = previewCount < previewProfilePosts.length;

  const loadMore = () => {
    if (isPreviewMode) {
      if (!hasMorePreview) return;
      setPreviewCount((current) =>
        Math.min(current + PREVIEW_GRID_PAGE_SIZE, previewProfilePosts.length),
      );
      return;
    }

    if (postsQuery.hasNextPage && !postsQuery.isFetchingNextPage) {
      void postsQuery.fetchNextPage();
    }
  };

  return (
    <SafeScreen edges={["top"]}>
      <FlatList
        data={posts}
        numColumns={3}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 28 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <>
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <Text className="text-base font-bold text-brand-dark">{profile.username}</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Text className="text-gray-600 text-lg">☰</Text>
              </TouchableOpacity>
            </View>

            <View className="px-4 py-4">
              <View className="flex-row items-center mb-4">
                <View className="mr-4">
                  <Avatar uri={profile.avatarUrl} username={profile.username} size="xl" />
                </View>
                <View className="flex-1 flex-row justify-around">
                  {[
                    [String(profile.postsCount), "Posts"],
                    [String(profile.followersCount), "Followers"],
                    [String(profile.followingCount), "Following"],
                  ].map(([count, label]) => (
                    <View key={label} className="items-center">
                      <Text className="text-base font-bold text-brand-dark">{count}</Text>
                      <Text className="text-xs text-gray-600">{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text className="text-sm font-semibold text-brand-dark">{profile.fullName}</Text>
              {profile.bio ? (
                <Text className="text-sm text-gray-600 mt-1">{profile.bio}</Text>
              ) : null}
              {profile.website ? (
                <Text className="text-sm text-brand-primary mt-1">{profile.website}</Text>
              ) : null}
              {isPreviewMode ? (
                <Text className="text-xs text-gray-400 mt-3">
                  Preview mode uses local profile fixtures.
                </Text>
              ) : null}
            </View>

            <View className="px-4 py-4 border-t border-gray-200">
              <Text className="text-sm font-semibold text-brand-dark">Recent posts</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          postsQuery.isLoading && !isPreviewMode ? (
            <LoadingSpinner />
          ) : (
            <EmptyState
              title="No posts yet"
              description="Once this account posts, the grid will be cached here."
            />
          )
        }
        ListFooterComponent={
          posts.length > 0 ? (
            <View className="items-center py-4">
              {postsQuery.isFetchingNextPage ? (
                <LoadingSpinner />
              ) : isPreviewMode && hasMorePreview ? (
                <Text className="text-xs text-gray-400">Scroll for more posts</Text>
              ) : postsQuery.hasNextPage ? (
                <Text className="text-xs text-gray-400">Loading more when you reach the end</Text>
              ) : (
                <Text className="text-xs text-gray-400">No more posts</Text>
              )}
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <View className="mb-2" style={{ marginRight: index % 3 === 2 ? 0 : 8 }}>
            <PostGridTile
              post={item}
              size={tileSize}
              onPress={(postId) => navigation.navigate("PostDetail", { postId })}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeScreen>
  );
}
