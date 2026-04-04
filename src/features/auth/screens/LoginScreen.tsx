import React from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  return (
    <SafeScreen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 px-6 justify-center">
          <Text className="text-2xl font-bold text-brand-dark mb-8 text-center">Log In</Text>

          {/* Placeholder inputs — wired to react-hook-form in full implementation */}
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-base"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-base"
            placeholder="Password"
            secureTextEntry
          />

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text className="text-brand-primary text-sm text-right mb-6">Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-brand-primary rounded-lg py-3 items-center mb-4">
            <Text className="text-white font-semibold text-base">Log In</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-500 text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-brand-primary font-semibold text-sm">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
