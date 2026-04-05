import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { LaunchIntroScreen } from "@/features/auth/screens/LaunchIntroScreen";
import { linking } from "./linking";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";
import type { RootStackParamList } from "./types";

const Root = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isHydrated, hydrateFromStorage } = useAuthStore();
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);

  useEffect(() => {
    void hydrateFromStorage();
  }, [hydrateFromStorage]);

  if (!isHydrated) {
    return <View className="flex-1 bg-white" />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Root.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
        {!hasCompletedIntro ? (
          <Root.Screen name="LaunchIntro">
            {() => <LaunchIntroScreen onFinish={() => setHasCompletedIntro(true)} />}
          </Root.Screen>
        ) : isAuthenticated ? (
          <Root.Screen name="App" component={AppNavigator} />
        ) : (
          <Root.Screen name="Auth" component={AuthNavigator} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}
