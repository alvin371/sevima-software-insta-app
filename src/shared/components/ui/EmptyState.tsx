import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Text className="text-lg font-semibold text-brand-dark text-center mb-2">{title}</Text>
      {description && (
        <Text className="text-sm text-gray-500 text-center mb-6">{description}</Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          className="border border-brand-primary rounded-lg px-6 py-2"
          onPress={onAction}
        >
          <Text className="text-brand-primary font-semibold text-sm">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
