import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "./types";

import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";
import { EditProfileScreen } from "@/features/profile/screens/EditProfileScreen";
import { FollowersScreen } from "@/features/profile/screens/FollowersScreen";
import { FollowingScreen } from "@/features/profile/screens/FollowingScreen";
import { PostDetailScreen } from "@/features/post/screens/PostDetailScreen";
import { SettingsScreen } from "@/features/settings/screens/SettingsScreen";
import { AccountSettingsScreen } from "@/features/settings/screens/AccountSettingsScreen";
import { PrivacySettingsScreen } from "@/features/settings/screens/PrivacySettingsScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
      <Stack.Screen name="Following" component={FollowingScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
    </Stack.Navigator>
  );
}
