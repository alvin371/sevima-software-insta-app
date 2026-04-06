import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FeedStackParamList } from "@/app/navigation/types";
import { useFeed } from "../hooks/useFeed";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { FeedPostCard } from "@/shared/components/post/FeedPostCard";
import {
  PREVIEW_ENABLED,
  PREVIEW_FEED_PAGE_SIZE,
  previewFeedPosts,
} from "@/shared/mocks/screenPreview";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function FeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const feedQuery = useFeed();
  const [previewCount, setPreviewCount] = useState(PREVIEW_FEED_PAGE_SIZE);
  const isPreviewMode = PREVIEW_ENABLED && !isAuthenticated;
  const livePosts = feedQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const posts = isPreviewMode ? previewFeedPosts.slice(0, previewCount) : livePosts;
  const hasMorePreview = previewCount < previewFeedPosts.length;
  const isLoadingInitial = isPreviewMode ? false : feedQuery.isLoading;
  const isError = isPreviewMode ? false : feedQuery.isError;
  const isFetchingMore = isPreviewMode ? false : feedQuery.isFetchingNextPage;
  const hasNextPage = isPreviewMode ? hasMorePreview : Boolean(feedQuery.hasNextPage);

  useEffect(() => {
    if (!isPreviewMode) return;
    setPreviewCount(PREVIEW_FEED_PAGE_SIZE);
  }, [isPreviewMode]);

  const loadMore = () => {
    if (isPreviewMode) {
      if (!hasMorePreview) return;
      setPreviewCount((current) =>
        Math.min(current + PREVIEW_FEED_PAGE_SIZE, previewFeedPosts.length),
      );
      return;
    }

    if (feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
      void feedQuery.fetchNextPage();
    }
  };

  if (isLoadingInitial) {
    return (
      <SafeScreen edges={["top"]}>
        <LoadingSpinner fullScreen />
      </SafeScreen>
    );
  }

  if (isError) {
    return (
      <SafeScreen edges={["top"]}>
        <EmptyState
          title="Could not load feed"
          description="Try again once the API is reachable."
          actionLabel="Retry"
          onAction={() => {
            void feedQuery.refetch();
          }}
        />
      </SafeScreen>
    );
  }

  return (
      <SafeScreen edges={["top"]}>
      <FlatList
        data={posts}
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={
          <>
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <Text className="text-2xl font-bold text-brand-dark">Insta App</Text>
              <View className="flex-row gap-4">
                <Text className="text-gray-600">♡</Text>
                <Text className="text-gray-600">✉</Text>
              </View>
            </View>

            <View className="border-b border-gray-200 px-4 py-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-brand-dark">Stories</Text>
                {isPreviewMode ? (
                  <Text className="text-xs text-brand-primary">Preview mode</Text>
                ) : null}
              </View>
              <View className="flex-row mt-4 gap-3">
                {previewFeedPosts.slice(0, 4).map((post) => (
                  <View key={`story-${post.id}`} className="items-center">
                    <View className="h-14 w-14 rounded-full border-2 border-brand-primary items-center justify-center">
                      <Text className="text-[11px] font-semibold text-brand-dark">
                        {post.author.username.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <Text className="text-[11px] text-gray-500 mt-2">{post.author.username}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nothing in your feed yet"
            description="Posts from the accounts you follow will show up here."
          />
        }
        ListFooterComponent={
          posts.length > 0 ? (
            <View className="items-center py-5">
              {isFetchingMore ? (
                <LoadingSpinner />
              ) : hasNextPage ? (
                <Text className="text-xs text-gray-400">Scroll for more posts</Text>
              ) : (
                <Text className="text-xs text-gray-400">You are all caught up</Text>
              )}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <FeedPostCard
            post={item}
            onPress={(postId) => navigation.navigate("PostDetail", { postId })}
            onPressComments={(postId) => navigation.navigate("PostDetail", { postId })}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeScreen>
  );
}
