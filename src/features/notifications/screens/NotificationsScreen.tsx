import React from "react";
import { View, Text } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";

export function NotificationsScreen() {
  return (
    <SafeScreen edges={["top"]}>
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold text-brand-dark">Activity</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">Notifications list here</Text>
        <Text className="text-gray-300 text-sm mt-1">Likes, comments, follows, mentions</Text>
      </View>
    </SafeScreen>
  );
}
