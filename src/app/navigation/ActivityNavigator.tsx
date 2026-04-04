import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ActivityStackParamList } from "./types";

import { NotificationsScreen } from "@/features/notifications/screens/NotificationsScreen";
import { PostDetailScreen } from "@/features/post/screens/PostDetailScreen";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";

const Stack = createNativeStackNavigator<ActivityStackParamList>();

export function ActivityNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="UserProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
