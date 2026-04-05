import React from "react";
import { Text, View } from "react-native";
import { authTheme } from "./authTheme";

export function AuthDivider() {
  return (
    <View className="flex-row items-center" style={{ marginVertical: 18 }}>
      <View className="flex-1" style={{ height: 1, backgroundColor: authTheme.divider }} />
      <Text
        className="font-semibold"
        style={{ color: authTheme.subtleText, fontSize: 11, marginHorizontal: 16, letterSpacing: 1.6 }}
      >
        OR
      </Text>
      <View className="flex-1" style={{ height: 1, backgroundColor: authTheme.divider }} />
    </View>
  );
}
