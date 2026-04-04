import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";

export function ProfileScreen() {
  const navigation = useNavigation();
  return (
    <SafeScreen edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <Text className="text-base font-bold text-brand-dark">username</Text>
        <TouchableOpacity onPress={() => (navigation as any).navigate("Settings")}>
          <Text className="text-gray-600 text-lg">☰</Text>
        </TouchableOpacity>
      </View>

      {/* Profile header */}
      <View className="px-4 py-4">
        <View className="flex-row items-center mb-4">
          <View className="w-20 h-20 rounded-full bg-gray-200 mr-4" />
          <View className="flex-1 flex-row justify-around">
            {[["0", "Posts"], ["0", "Followers"], ["0", "Following"]].map(([count, label]) => (
              <View key={label} className="items-center">
                <Text className="text-base font-bold text-brand-dark">{count}</Text>
                <Text className="text-xs text-gray-600">{label}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text className="text-sm font-semibold text-brand-dark">Full Name</Text>
        <Text className="text-sm text-gray-600">Bio placeholder</Text>
      </View>

      {/* Post grid placeholder */}
      <View className="flex-1 items-center justify-center border-t border-gray-200">
        <Text className="text-gray-400 text-base">Post grid (3 columns)</Text>
      </View>
    </SafeScreen>
  );
}
