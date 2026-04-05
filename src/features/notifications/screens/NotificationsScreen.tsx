import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ActivityStackParamList } from "@/app/navigation/types";
import { useNotifications } from "../hooks/useNotifications";
import { useMarkAllNotificationsRead } from "../hooks/useMarkAllNotificationsRead";
import { useRefreshOnFocus } from "@/shared/hooks/useRefreshOnFocus";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { EmptyState } from "@/shared/components/ui/EmptyState";

export function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ActivityStackParamList>>();
  const notificationsQuery = useNotifications();
  const markAllReadMutation = useMarkAllNotificationsRead();

  useRefreshOnFocus(() => {
    void notificationsQuery.refetch();
  });

  const notifications = notificationsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <SafeScreen edges={["top"]}>
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-brand-dark">Activity</Text>
        <TouchableOpacity
          disabled={markAllReadMutation.isPending || notifications.length === 0}
          onPress={() => markAllReadMutation.mutate()}
        >
          <Text className="text-sm font-semibold text-brand-primary">Mark all read</Text>
        </TouchableOpacity>
      </View>

      {notificationsQuery.isLoading ? (
        <LoadingSpinner fullScreen />
      ) : notificationsQuery.isError ? (
        <EmptyState
          title="Could not load activity"
          description="Notifications will appear here once the API call succeeds."
          actionLabel="Retry"
          onAction={() => {
            void notificationsQuery.refetch();
          }}
        />
      ) : notifications.length > 0 ? (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              className="px-4 py-4 border-b border-gray-100"
              onPress={() => {
                if (notification.post?.id) {
                  navigation.navigate("PostDetail", { postId: notification.post.id });
                } else {
                  navigation.navigate("UserProfile", {
                    username: notification.actor.username,
                  });
                }
              }}
            >
              <Text className="text-sm font-semibold text-brand-dark">
                {notification.actor.username}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                {notification.type.replaceAll("_", " ")}
              </Text>
              {!notification.isRead ? (
                <Text className="text-xs text-brand-primary mt-1">New</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <EmptyState
          title="No activity yet"
          description="Likes, follows, and comments will appear here and stay cached."
        />
      )}
    </SafeScreen>
  );
}
