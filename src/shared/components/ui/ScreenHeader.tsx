import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/shared/constants/colors";

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function ScreenHeader({ title, showBack = true, rightElement }: ScreenHeaderProps) {
  const navigation = useNavigation();
  return (
    <View className="flex-row items-center justify-between px-4 h-14 border-b border-gray-200 bg-white">
      <View className="w-10">
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={colors.brand.dark} />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-base font-semibold text-brand-dark flex-1 text-center">{title}</Text>
      <View className="w-10 items-end">{rightElement}</View>
    </View>
  );
}
