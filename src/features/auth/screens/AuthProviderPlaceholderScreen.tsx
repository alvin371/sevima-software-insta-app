import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/app/navigation/types";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { authTheme } from "../components/authTheme";

type Props = NativeStackScreenProps<AuthStackParamList, "AuthProviderPlaceholder">;

export function AuthProviderPlaceholderScreen({ navigation, route }: Props) {
  const { provider } = route.params;

  return (
    <SafeScreen style={{ backgroundColor: authTheme.background }}>
      <View className="flex-1 px-7 justify-center">
        <Text
          className="font-bold text-center"
          style={{ color: authTheme.text, fontSize: 30, lineHeight: 36 }}
        >
          {provider} Sign In
        </Text>
        <Text
          className="font-medium text-center"
          style={{ color: authTheme.mutedText, fontSize: 15, lineHeight: 22, marginTop: 12 }}
        >
          This sign-in option is not available yet in the current app build.
        </Text>

        <TouchableOpacity
          activeOpacity={0.82}
          className="items-center justify-center"
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 28,
            height: 48,
            borderRadius: 12,
            backgroundColor: authTheme.darkButton,
          }}
        >
          <Text className="font-semibold" style={{ color: "#fff", fontSize: 16 }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
