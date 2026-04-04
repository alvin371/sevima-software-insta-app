import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen({ navigation }: Props) {
  return (
    <SafeScreen>
      <View className="flex-1 px-6 justify-center">
        <TouchableOpacity className="absolute top-4 left-6" onPress={() => navigation.goBack()}>
          <Text className="text-brand-primary text-base">Back</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-brand-dark mb-3 text-center">
          Forgot Password?
        </Text>
        <Text className="text-sm text-gray-500 mb-8 text-center">
          Enter your email and we'll send a reset link.
        </Text>

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity className="bg-brand-primary rounded-lg py-3 items-center">
          <Text className="text-white font-semibold text-base">Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
