import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { FeedStackParamList } from "./types";

import { FeedScreen } from "@/features/feed/screens/FeedScreen";
import { PostDetailScreen } from "@/features/post/screens/PostDetailScreen";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";

const Stack = createNativeStackNavigator<FeedStackParamList>();

export function FeedNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="UserProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
