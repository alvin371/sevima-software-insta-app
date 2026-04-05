import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import type { PostPreview } from "@/shared/types/models.types";

interface PostGridTileProps {
  post: PostPreview;
  size: number;
  onPress?: (postId: string) => void;
}

export function PostGridTile({ post, size, onPress }: PostGridTileProps) {
  const media = post.media[0];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ width: size, height: size }}
      className="rounded-2xl overflow-hidden bg-gray-100"
      onPress={() => onPress?.(post.id)}
    >
      {media?.url ? (
        <Image
          source={{ uri: media.url }}
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-gray-100">
          <Text className="text-xs text-gray-400">No media</Text>
        </View>
      )}
      <View className="absolute inset-x-0 bottom-0 bg-black/35 px-2 py-2">
        <Text className="text-[11px] font-semibold text-white">{post.likesCount} likes</Text>
        <Text className="text-[10px] text-white/90">{post.commentsCount} comments</Text>
      </View>
    </TouchableOpacity>
  );
}
