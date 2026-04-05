import React, { useEffect, useState } from "react";
import { View, Text, FlatList, useWindowDimensions } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { SearchStackParamList } from "@/app/navigation/types";
import { useExplore } from "../hooks/useExplore";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { PostGridTile } from "@/shared/components/post/PostGridTile";
import {
  PREVIEW_ENABLED,
  PREVIEW_GRID_PAGE_SIZE,
  previewExplorePosts,
} from "@/shared/mocks/screenPreview";

export function ExploreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const { width } = useWindowDimensions();
  const exploreQuery = useExplore();
  const [previewCount, setPreviewCount] = useState(PREVIEW_GRID_PAGE_SIZE);
  const isPreviewMode = PREVIEW_ENABLED;
  const posts = isPreviewMode
    ? previewExplorePosts.slice(0, previewCount)
    : (exploreQuery.data ?? []);
  const tileSize = Math.floor((width - 40) / 3);
  const hasMorePreview = previewCount < previewExplorePosts.length;

  useEffect(() => {
    if (!isPreviewMode) return;
    setPreviewCount(PREVIEW_GRID_PAGE_SIZE);
  }, [isPreviewMode]);

  const loadMore = () => {
    if (!isPreviewMode || !hasMorePreview) return;
    setPreviewCount((current) => Math.min(current + PREVIEW_GRID_PAGE_SIZE, previewExplorePosts.length));
  };

  if (!isPreviewMode && exploreQuery.isLoading) {
    return (
      <SafeScreen edges={["top"]}>
        <LoadingSpinner fullScreen />
      </SafeScreen>
    );
  }

  if (!isPreviewMode && exploreQuery.isError) {
    return (
      <SafeScreen edges={["top"]}>
        <EmptyState
          title="Could not load explore"
          description="Try again once the API is reachable."
          actionLabel="Retry"
          onAction={() => {
            void exploreQuery.refetch();
          }}
        />
      </SafeScreen>
    );
  }

  return (
      <SafeScreen edges={["top"]}>
      <FlatList
        data={posts}
        numColumns={3}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 28 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View className="mb-4 px-1">
            <Text className="text-xl font-bold text-brand-dark">Explore</Text>
            <Text className="text-sm text-gray-500 mt-1">
              {isPreviewMode
                ? "Previewing a denser 3-column grid with local mock posts."
                : "Trending posts from the current explore endpoint."}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nothing to explore yet"
            description="Explore posts will appear here once data is available."
          />
        }
        ListFooterComponent={
          posts.length > 0 ? (
            <View className="items-center pt-4">
              {isPreviewMode && hasMorePreview ? (
                <Text className="text-xs text-gray-400">Scroll for more preview posts</Text>
              ) : (
                <Text className="text-xs text-gray-400">End of explore grid</Text>
              )}
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <View
            className="mb-2"
            style={{ marginRight: index % 3 === 2 ? 0 : 8 }}
          >
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
