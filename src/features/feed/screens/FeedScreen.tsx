import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";

// Placeholder — full implementation uses FlashList + useFeed (useInfiniteQuery)
export function FeedScreen() {
  return (
    <SafeScreen edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold text-brand-dark">InstaApp</Text>
        <View className="flex-row gap-4">
          <Text className="text-gray-600">♡</Text>
          <Text className="text-gray-600">✉</Text>
        </View>
      </View>

      {/* Stories placeholder */}
      <View className="h-20 border-b border-gray-200 items-center justify-center">
        <Text className="text-gray-400 text-sm">Stories bar — coming soon</Text>
      </View>

      {/* Feed placeholder */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">Feed — PostCards go here</Text>
        <Text className="text-gray-300 text-sm mt-1">Powered by FlashList + React Query</Text>
      </View>
    </SafeScreen>
  );
}
