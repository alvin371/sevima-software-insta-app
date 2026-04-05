import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, type ViewStyle } from "react-native";
import { authTheme } from "./authTheme";

interface AuthActionButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
}

export function AuthActionButton({
  label,
  onPress,
  icon,
  disabled = false,
  isLoading = false,
  variant = "primary",
  style,
}: AuthActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      accessibilityRole="button"
      disabled={disabled || isLoading}
      onPress={onPress}
      className="w-full items-center justify-center flex-row"
      style={[
        {
          height: isPrimary ? 48 : 46,
          borderRadius: isPrimary ? 12 : 11,
          backgroundColor: isPrimary ? authTheme.darkButton : authTheme.surface,
          borderWidth: isPrimary ? 0 : 1,
          borderColor: isPrimary ? "transparent" : authTheme.fieldBorder,
          shadowColor: isPrimary ? authTheme.shadow : "transparent",
          shadowOpacity: isPrimary ? 1 : 0,
          shadowRadius: isPrimary ? 18 : 0,
          shadowOffset: isPrimary ? { width: 0, height: 10 } : { width: 0, height: 0 },
          elevation: isPrimary ? 3 : 0,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon ? <View style={{ marginRight: 10 }}>{icon}</View> : null}
          <Text
            className="font-semibold"
            style={{
              color: isPrimary ? "#ffffff" : authTheme.text,
              fontSize: isPrimary ? 16 : 15,
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
