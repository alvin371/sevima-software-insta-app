import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { CreateStackScreenProps } from "@/app/navigation/types";

type Props = CreateStackScreenProps<"EditPost">;

export function EditPostScreen() {
  const navigation = useNavigation();
  const route = useRoute<Props["route"]>();

  return (
    <SafeScreen>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-gray-600">Back</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">Edit</Text>
        <TouchableOpacity>
          <Text className="text-brand-primary font-semibold text-base">Next</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">Image crop + filter controls here</Text>
        <Text className="text-gray-300 text-sm mt-1">URI: {route.params?.uri}</Text>
      </View>
    </SafeScreen>
  );
}
