import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { ProfileStackScreenProps } from "@/app/navigation/types";

type Props = ProfileStackScreenProps<"Followers">;

export function FollowersScreen() {
  const navigation = useNavigation();
  const route = useRoute<Props["route"]>();

  return (
    <SafeScreen>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-brand-dark text-base mr-4">‹</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">
          {route.params?.username} · Followers
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 text-base">Followers list here</Text>
      </View>
    </SafeScreen>
  );
}
