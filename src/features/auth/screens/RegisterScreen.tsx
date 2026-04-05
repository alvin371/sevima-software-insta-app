import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { AntDesign } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/app/navigation/types";
import { registerSchema, type RegisterFormData } from "@/shared/utils/validation";
import { useRegister } from "../hooks/useRegister";
import { AuthActionButton } from "../components/AuthActionButton";
import { AuthDivider } from "../components/AuthDivider";
import { AuthScreenLayout } from "../components/AuthScreenLayout";
import { AuthTextField } from "../components/AuthTextField";
import { authTheme } from "../components/authTheme";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const responseData = error.response.data;
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }
  }

  return "We couldn't create your account right now. Please try again.";
}

export function RegisterScreen({ navigation }: Props) {
  const registerMutation = useRegister();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string") {
          setError(fieldName as keyof RegisterFormData, { message: issue.message });
        }
      });
      return;
    }

    const payload = {
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      username: parsed.data.username,
      password: parsed.data.password,
    };

    try {
      await registerMutation.mutateAsync(payload);
    } catch (error) {
      Alert.alert("Sign up failed", getErrorMessage(error));
    }
  });

  return (
    <AuthScreenLayout
      title="Insta App"
      subtitle="Create your account."
      scrollable
      contentContainerStyle={{ paddingBottom: 38 }}
      footer={
        <View className="items-center" style={{ marginTop: 22 }}>
          <View className="flex-row justify-center">
            <Text className="font-medium" style={{ color: authTheme.mutedText, fontSize: 15 }}>
              Already part of the collective?{" "}
            </Text>
            <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.navigate("Login")}>
              <Text className="font-bold" style={{ color: authTheme.text, fontSize: 15 }}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    >
      <View
        style={{
          borderRadius: 14,
          backgroundColor: authTheme.surface,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 18,
          shadowColor: authTheme.shadow,
          shadowOpacity: 1,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 12 },
          elevation: 3,
        }}
      >
        <AuthActionButton
          label="Continue with Google"
          variant="secondary"
          onPress={() => navigation.navigate("AuthProviderPlaceholder", { provider: "Google" })}
          icon={<AntDesign name="google" size={18} color="#4285F4" />}
          style={{ backgroundColor: "#efe4e4", borderWidth: 0 }}
        />

        <View style={{ paddingHorizontal: 12 }}>
          <AuthDivider />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextField
                label="EMAIL ADDRESS"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="example@curator.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextField
                label="FULL NAME"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Julianne Moore"
                autoCapitalize="words"
                textContentType="name"
                autoComplete="name"
                returnKeyType="next"
                error={errors.fullName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextField
                label="USERNAME"
                value={value}
                onChangeText={(text) => onChange(text.toLowerCase())}
                onBlur={onBlur}
                placeholder="curated_spirit"
                autoCapitalize="none"
                textContentType="username"
                autoComplete="username"
                returnKeyType="next"
                error={errors.username?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextField
                label="PASSWORD"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextField
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Confirm password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <AuthActionButton
            label="Create Account"
            onPress={onSubmit}
            isLoading={registerMutation.isPending}
            style={{ marginTop: 6 }}
          />

          <Text
            className="font-medium text-center"
            style={{ color: "#82797d", fontSize: 12, lineHeight: 18, marginTop: 18 }}
          >
            By signing up, you agree to our{" "}
            <Text className="font-bold" style={{ color: authTheme.text }}>
              Terms,
            </Text>{" "}
            <Text className="font-bold" style={{ color: authTheme.text }}>
              Privacy Policy
            </Text>{" "}
            and{" "}
            <Text className="font-bold" style={{ color: authTheme.text }}>
              Cookies Policy.
            </Text>
          </Text>
        </View>
      </View>

      <View className="items-center" style={{ marginTop: 28 }}>
        <View className="flex-row" style={{ columnGap: 18 }}>
          <View style={{ width: 72, height: 24, borderRadius: 3, backgroundColor: "#b1acad" }} />
          <View style={{ width: 72, height: 24, borderRadius: 3, backgroundColor: "#b1acad" }} />
        </View>
      </View>
    </AuthScreenLayout>
  );
}
