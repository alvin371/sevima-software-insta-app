import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-6 bg-white">
        <Text className="text-3xl font-bold text-brand-dark mb-2">Insta App</Text>
        <Text className="text-base text-gray-500 mb-12 text-center">
          Capture and share moments with the world.
        </Text>
        <TouchableOpacity
          className="w-full bg-brand-primary rounded-lg py-3 items-center mb-3"
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="text-white font-semibold text-base">Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full border border-gray-300 rounded-lg py-3 items-center"
          onPress={() => navigation.navigate("Register")}
        >
          <Text className="text-brand-dark font-semibold text-base">Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
