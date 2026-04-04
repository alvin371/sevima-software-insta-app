import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";

export function CreatePostScreen() {
  const navigation = useNavigation();
  return (
    <SafeScreen>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-gray-600">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">New Post</Text>
        <View className="w-12" />
      </View>
      <View className="flex-1 items-center justify-center gap-4">
        <View className="w-40 h-40 bg-gray-100 rounded-2xl items-center justify-center">
          <Text className="text-4xl">📷</Text>
        </View>
        <Text className="text-gray-500 text-base">Tap to select a photo or video</Text>
        <Text className="text-gray-300 text-sm">expo-image-picker integration here</Text>
      </View>
    </SafeScreen>
  );
}
