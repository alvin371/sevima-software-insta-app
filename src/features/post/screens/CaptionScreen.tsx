import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";

export function CaptionScreen() {
  const navigation = useNavigation();
  return (
    <SafeScreen>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-gray-600">Back</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">New Post</Text>
        <TouchableOpacity>
          <Text className="text-brand-primary font-semibold text-base">Share</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-start gap-3 mb-4">
          <View className="w-16 h-16 bg-gray-100 rounded-lg" />
          <TextInput
            className="flex-1 text-base text-brand-dark"
            placeholder="Write a caption..."
            multiline
            maxLength={2200}
          />
        </View>
        <View className="border-t border-gray-200 py-3">
          <Text className="text-gray-400 text-sm">Tag people</Text>
        </View>
        <View className="border-t border-gray-200 py-3">
          <Text className="text-gray-400 text-sm">Add location</Text>
        </View>
      </View>
    </SafeScreen>
  );
}
