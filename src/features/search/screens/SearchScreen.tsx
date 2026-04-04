import React from "react";
import { View, Text, TextInput } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";

export function SearchScreen() {
  return (
    <SafeScreen edges={["top"]}>
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="bg-gray-100 rounded-lg px-4 py-2 flex-row items-center">
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-base text-brand-dark"
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">Search results appear here</Text>
        <Text className="text-gray-300 text-sm mt-1">Users, hashtags, locations</Text>
      </View>
    </SafeScreen>
  );
}
