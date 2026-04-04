import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";

export function EditProfileScreen() {
  const navigation = useNavigation();
  return (
    <SafeScreen>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-gray-600">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">Edit Profile</Text>
        <TouchableOpacity>
          <Text className="text-brand-primary font-semibold text-base">Done</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 px-4 pt-6">
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-gray-200 mb-2" />
          <Text className="text-brand-primary text-sm font-semibold">Change photo</Text>
        </View>
        {["Full Name", "Username", "Bio", "Website"].map((field) => (
          <View key={field} className="mb-4">
            <Text className="text-xs text-gray-500 mb-1">{field}</Text>
            <TextInput
              className="border-b border-gray-200 pb-2 text-base text-brand-dark"
              placeholder={field}
            />
          </View>
        ))}
      </View>
    </SafeScreen>
  );
}
