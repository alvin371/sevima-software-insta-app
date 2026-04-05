import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { AntDesign } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/app/navigation/types";
import { loginSchema, type LoginFormData } from "@/shared/utils/validation";
import { useLogin } from "../hooks/useLogin";
import { AuthActionButton } from "../components/AuthActionButton";
import { AuthDivider } from "../components/AuthDivider";
import { AuthScreenLayout } from "../components/AuthScreenLayout";
import { AuthTextField } from "../components/AuthTextField";
import { authTheme } from "../components/authTheme";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

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

  return "Please check your credentials and try again.";
}

export function LoginScreen({ navigation }: Props) {
  const loginMutation = useLogin();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string") {
          setError(fieldName as keyof LoginFormData, { message: issue.message });
        }
      });
      return;
    }

    try {
      await loginMutation.mutateAsync(parsed.data);
    } catch (error) {
      Alert.alert("Login failed", getErrorMessage(error));
    }
  });

  return (
    <AuthScreenLayout
      title="Insta App"
      subtitle="Step into the gallery of the future."
      contentContainerStyle={{ justifyContent: "space-between" }}
      footer={
        <View style={{ paddingTop: 26 }}>
          <View className="flex-row justify-center" style={{ marginBottom: 34 }}>
            <Text className="font-medium" style={{ color: authTheme.mutedText, fontSize: 15 }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.navigate("Register")}>
              <Text className="font-bold" style={{ color: authTheme.accent, fontSize: 15 }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center" style={{ columnGap: 18 }}>
            {["TERMS", "PRIVACY", "HELP", "LANGUAGE"].map((item) => (
              <Text
                key={item}
                className="font-semibold"
                style={{ color: authTheme.subtleText, fontSize: 10, letterSpacing: 0.8 }}
              >
                {item}
              </Text>
            ))}
          </View>
        </View>
      }
    >
      <View>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthTextField
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Email or Username"
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
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthTextField
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              error={errors.password?.message}
            />
          )}
        />

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate("ForgotPassword")}
          style={{ marginTop: 4, marginBottom: 26, alignSelf: "flex-end" }}
        >
          <Text className="font-semibold" style={{ color: "#6d6468", fontSize: 14 }}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <AuthActionButton
          label="Log In"
          onPress={onSubmit}
          isLoading={loginMutation.isPending}
        />

        <AuthDivider />

        <AuthActionButton
          label="Continue with Google"
          variant="secondary"
          onPress={() => navigation.navigate("AuthProviderPlaceholder", { provider: "Google" })}
          icon={<AntDesign name="google" size={19} color="#4285F4" />}
          style={{ marginTop: 2 }}
        />
      </View>
    </AuthScreenLayout>
  );
}
