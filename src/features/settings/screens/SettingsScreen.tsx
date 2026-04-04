import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/features/auth/store/auth.store";

const SETTINGS_ROWS = [
  { label: "Account", screen: "AccountSettings" as const },
  { label: "Privacy", screen: "PrivacySettings" as const },
];

export function SettingsScreen() {
  const navigation = useNavigation();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return (
    <SafeScreen>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-brand-dark text-base mr-4">‹</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">Settings</Text>
      </View>
      <ScrollView className="flex-1">
        {SETTINGS_ROWS.map(({ label, screen }) => (
          <TouchableOpacity
            key={screen}
            className="px-4 py-4 border-b border-gray-100 flex-row justify-between items-center"
            onPress={() => (navigation as any).navigate(screen)}
          >
            <Text className="text-base text-brand-dark">{label}</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          className="px-4 py-4 border-t border-gray-200 mt-4"
          onPress={clearAuth}
        >
          <Text className="text-base text-red-500 font-semibold">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
}
