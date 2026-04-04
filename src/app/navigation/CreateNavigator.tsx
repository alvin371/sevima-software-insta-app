import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { CreateStackParamList } from "./types";

import { CreatePostScreen } from "@/features/post/screens/CreatePostScreen";
import { EditPostScreen } from "@/features/post/screens/EditPostScreen";
import { CaptionScreen } from "@/features/post/screens/CaptionScreen";

const Stack = createNativeStackNavigator<CreateStackParamList>();

export function CreateNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: "modal" }}>
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
      <Stack.Screen name="Caption" component={CaptionScreen} />
    </Stack.Navigator>
  );
}
