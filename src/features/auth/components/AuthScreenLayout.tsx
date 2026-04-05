import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  type ScrollViewProps,
  type ViewStyle,
} from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { authTheme } from "./authTheme";

interface AuthScreenLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  scrollProps?: Omit<ScrollViewProps, "children">;
}

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  footer,
  scrollable = false,
  contentContainerStyle,
  scrollProps,
}: AuthScreenLayoutProps) {
  const body = (
    <>
      <View className="items-center" style={{ marginBottom: scrollable ? 28 : 34 }}>
        <Text
          className="font-bold text-center"
          style={{ color: authTheme.text, fontSize: scrollable ? 33 : 30, lineHeight: scrollable ? 38 : 34 }}
        >
          {title}
        </Text>
        <Text
          className="font-medium text-center"
          style={{ color: authTheme.mutedText, fontSize: 15, lineHeight: 22, marginTop: 8 }}
        >
          {subtitle}
        </Text>
      </View>
      {children}
      {footer}
    </>
  );

  return (
    <SafeScreen style={{ backgroundColor: authTheme.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scrollable ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={[
              {
                paddingHorizontal: 18,
                paddingTop: 14,
                paddingBottom: 30,
              },
              contentContainerStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            {...scrollProps}
          >
            {body}
          </ScrollView>
        ) : (
          <View
            className="flex-1"
            style={[
              {
                paddingHorizontal: 28,
                paddingTop: 44,
                paddingBottom: 18,
              },
              contentContainerStyle,
            ]}
          >
            {body}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
