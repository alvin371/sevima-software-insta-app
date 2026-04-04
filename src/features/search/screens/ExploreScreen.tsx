import React from "react";
import { View, Text } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";

export function ExploreScreen() {
  return (
    <SafeScreen edges={["top"]}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">Explore Grid</Text>
        <Text className="text-gray-300 text-sm mt-1">3-column masonry grid — trending posts</Text>
      </View>
    </SafeScreen>
  );
}
