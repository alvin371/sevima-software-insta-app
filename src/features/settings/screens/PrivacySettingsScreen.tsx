import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/shared/constants/colors";

export function PrivacySettingsScreen() {
  const navigation = useNavigation();
  const [isPrivate, setIsPrivate] = React.useState(false);

  return (
    <SafeScreen>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-brand-dark text-base mr-4">‹</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">Privacy</Text>
      </View>
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
          <View className="flex-1 mr-4">
            <Text className="text-base text-brand-dark">Private Account</Text>
            <Text className="text-xs text-gray-500 mt-0.5">
              Only approved followers can see your posts.
            </Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: colors.gray[200], true: colors.brand.primary }}
          />
        </View>
        {["Blocked Accounts", "Muted Accounts", "Restricted Accounts"].map((item) => (
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
