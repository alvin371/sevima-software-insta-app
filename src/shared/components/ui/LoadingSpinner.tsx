import React from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/shared/constants/colors";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  color?: string;
}

export function LoadingSpinner({ fullScreen = false, color = colors.brand.primary }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={color} />
      </View>
    );
  }
  return <ActivityIndicator size="small" color={color} />;
}
