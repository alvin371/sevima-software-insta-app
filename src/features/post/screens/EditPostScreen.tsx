import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import type { CreateStackScreenProps } from "@/app/navigation/types";

type Props = CreateStackScreenProps<"EditPost">;

export function EditPostScreen({ navigation, route }: Props) {
  const { draft } = route.params;

  return (
    <SafeScreen>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.navigate("CreatePost", { draft })}>
          <Text className="text-base text-gray-600">Back</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">Edit</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Caption", { draft })}>
          <Text className="text-brand-primary font-semibold text-base">Next</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 bg-black items-center justify-center px-4">
        <Image
          source={{ uri: draft.uri }}
          contentFit="contain"
          style={{ width: "100%", height: "78%" }}
        />
        <View className="w-full pt-5">
          <Text className="text-white text-base font-semibold text-center">Preview</Text>
          <Text className="text-gray-300 text-sm text-center mt-2">
            Crop and filters can land later. For now, confirm the selected image and continue.
          </Text>
        </View>
      </View>
    </SafeScreen>
  );
}
