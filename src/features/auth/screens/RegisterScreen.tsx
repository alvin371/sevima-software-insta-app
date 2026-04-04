import React from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  return (
    <SafeScreen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-bold text-brand-dark mb-2 text-center">Create Account</Text>
          <Text className="text-sm text-gray-500 mb-8 text-center">
            Sign up to see photos from your friends.
          </Text>

          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-base"
            placeholder="Full Name"
            autoCapitalize="words"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-base"
            placeholder="Username"
            autoCapitalize="none"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-base"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-base"
            placeholder="Password"
            secureTextEntry
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
            placeholder="Confirm Password"
            secureTextEntry
          />

          <TouchableOpacity className="bg-brand-primary rounded-lg py-3 items-center mb-4">
            <Text className="text-white font-semibold text-base">Create Account</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-500 text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-brand-primary font-semibold text-sm">Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
