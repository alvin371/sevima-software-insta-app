import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";

export function AccountSettingsScreen() {
  const navigation = useNavigation();
  return (
    <SafeScreen>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-brand-dark text-base mr-4">‹</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">Account</Text>
      </View>
      <View className="flex-1 px-4 pt-4">
        {["Change Password", "Email", "Phone Number", "Linked Accounts"].map((item) => (
          <TouchableOpacity
            key={item}
            className="py-4 border-b border-gray-100 flex-row justify-between items-center"
          >
            <Text className="text-base text-brand-dark">{item}</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeScreen>
  );
}
