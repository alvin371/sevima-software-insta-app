import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { SearchStackParamList } from "./types";

import { SearchScreen } from "@/features/search/screens/SearchScreen";
import { ExploreScreen } from "@/features/search/screens/ExploreScreen";
import { PostDetailScreen } from "@/features/post/screens/PostDetailScreen";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="UserProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
