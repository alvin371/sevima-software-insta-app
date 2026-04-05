import React from "react";
import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import type { Post } from "@/shared/types/models.types";
import { Avatar } from "@/shared/components/ui/Avatar";
import { getPostImageHeight } from "@/shared/utils/image";

interface FeedPostCardProps {
  post: Post;
  onPress?: (postId: string) => void;
}

export function FeedPostCard({ post, onPress }: FeedPostCardProps) {
  const { width } = useWindowDimensions();
  const primaryMedia = post.media[0];
  const imageHeight = getPostImageHeight(primaryMedia?.width ?? 1080, primaryMedia?.height ?? 1080, width);

  return (
    <View className="pb-6">
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center flex-1">
          <Avatar uri={post.author.avatarUrl} username={post.author.username} />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-semibold text-brand-dark">{post.author.username}</Text>
            {post.location ? <Text className="text-xs text-gray-500 mt-0.5">{post.location}</Text> : null}
          </View>
        </View>
        <Text className="text-lg text-gray-500">⋯</Text>
      </View>

      <TouchableOpacity activeOpacity={0.95} onPress={() => onPress?.(post.id)}>
        <Image
          source={{ uri: primaryMedia?.url }}
          style={{ width, height: imageHeight, backgroundColor: "#F3F4F6" }}
          contentFit="cover"
          transition={150}
        />
      </TouchableOpacity>

      <View className="px-4 pt-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <Text className="text-lg">♡</Text>
            <Text className="text-lg">💬</Text>
            <Text className="text-lg">↗</Text>
          </View>
          <Text className="text-lg">{post.isSavedByMe ? "🔖" : "▢"}</Text>
        </View>
        <Text className="text-sm font-semibold text-brand-dark mt-3">{post.likesCount} likes</Text>
        {post.caption ? (
          <Text className="text-sm text-brand-dark mt-1 leading-5">
            <Text className="font-semibold">{post.author.username} </Text>
            {post.caption}
          </Text>
        ) : null}
        <Text className="text-xs text-gray-500 mt-2">View all {post.commentsCount} comments</Text>
      </View>
    </View>
  );
}

