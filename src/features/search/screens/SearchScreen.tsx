import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearch } from "../hooks/useSearch";
import { useExplore } from "../hooks/useExplore";
import { useRefreshOnFocus } from "@/shared/hooks/useRefreshOnFocus";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { SearchStackParamList } from "@/app/navigation/types";

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const searchQuery = useSearch(debouncedQuery);
  const exploreQuery = useExplore();
  const normalizedQuery = debouncedQuery.trim();
  const activeQuery = normalizedQuery ? searchQuery : exploreQuery;

  useRefreshOnFocus(() => {
    void activeQuery.refetch();
  });

  const users = searchQuery.data?.users ?? [];
  const posts = normalizedQuery
    ? searchQuery.data?.posts ?? []
    : exploreQuery.data ?? [];

  return (
    <SafeScreen edges={["top"]}>
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="bg-gray-100 rounded-lg px-4 py-2 flex-row items-center">
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-base text-brand-dark"
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
        </View>
      </View>

      {activeQuery.isLoading ? (
        <LoadingSpinner fullScreen />
      ) : activeQuery.isError ? (
        <EmptyState
          title="Could not load search data"
          description="Try again once the API is reachable."
          actionLabel="Retry"
          onAction={() => {
            void activeQuery.refetch();
          }}
        />
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          {normalizedQuery ? (
            <>
              <Text className="text-sm font-semibold text-brand-dark mb-3">Users</Text>
              {users.length > 0 ? (
                users.slice(0, 5).map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    className="py-3 border-b border-gray-100"
                    onPress={() => navigation.navigate("UserProfile", { username: user.username })}
                  >
                    <Text className="text-sm font-semibold text-brand-dark">{user.username}</Text>
                    <Text className="text-sm text-gray-500 mt-1">{user.fullName}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-sm text-gray-500 mb-6">No users match your search.</Text>
              )}
            </>
          ) : (
            <Text className="text-sm font-semibold text-brand-dark mb-3">Explore</Text>
          )}

          <Text className="text-sm font-semibold text-brand-dark mt-4 mb-3">
            {normalizedQuery ? "Posts" : "Trending posts"}
          </Text>
          {posts.length > 0 ? (
            <View className="flex-row flex-wrap justify-between">
              {posts.slice(0, 12).map((post) => (
                <TouchableOpacity
                  key={post.id}
                  className="w-[31%] aspect-square bg-gray-100 rounded-xl mb-3 items-center justify-center"
                  onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
                >
                  <Text className="text-xs font-semibold text-brand-dark">{post.likesCount} likes</Text>
                  <Text className="text-[11px] text-gray-500 mt-1">
                    {post.commentsCount} comments
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <EmptyState
              title={normalizedQuery ? "No search results" : "Nothing to explore yet"}
              description={
                normalizedQuery
                  ? "Try a different keyword to reuse cached search data."
                  : "Explore posts will appear here once the API responds."
              }
            />
          )}
        </ScrollView>
      )}
    </SafeScreen>
  );
}
