import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";

export function PostDetailScreen() {
  const navigation = useNavigation();
  return (
    <SafeScreen>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-brand-dark text-base">‹ Back</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark ml-4">Post</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">Post image + caption here</Text>
        <Text className="text-gray-300 text-sm mt-1">Comments list below</Text>
      </View>
    </SafeScreen>
  );
}
