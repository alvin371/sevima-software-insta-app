import React from "react";
import { Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import type { Post } from "@/shared/types/models.types";
import { Avatar } from "@/shared/components/ui/Avatar";
import { getPostImageHeight } from "@/shared/utils/image";
import { useLikePost } from "@/features/post";
import { isPreviewPostId } from "@/shared/mocks/screenPreview";

interface FeedPostCardProps {
  post: Post;
  onPress?: (postId: string) => void;
  onPressComments?: (postId: string) => void;
}

export function FeedPostCard({ post, onPress, onPressComments }: FeedPostCardProps) {
  const { width } = useWindowDimensions();
  const likePostMutation = useLikePost();
  const isPreviewPost = isPreviewPostId(post.id);
  const [previewLiked, setPreviewLiked] = React.useState(post.isLikedByMe);
  const [previewLikesCount, setPreviewLikesCount] = React.useState(post.likesCount);
  const primaryMedia = post.media[0];
  const imageHeight = getPostImageHeight(primaryMedia?.width ?? 1080, primaryMedia?.height ?? 1080, width);
  const isLiked = isPreviewPost ? previewLiked : post.isLikedByMe;
  const likesCount = isPreviewPost ? previewLikesCount : post.likesCount;

  const handleLikePress = () => {
    if (isPreviewPost) {
      setPreviewLiked((current) => {
        setPreviewLikesCount((count) => count + (current ? -1 : 1));
        return !current;
      });
      return;
    }

    likePostMutation.mutate({ postId: post.id, isLiked: post.isLikedByMe });
  };

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
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={!isPreviewPost && likePostMutation.isPending}
              onPress={handleLikePress}
            >
              <Text className={isLiked ? "text-lg text-brand-primary" : "text-lg text-brand-dark"}>
                {isLiked ? "♥" : "♡"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => onPressComments?.(post.id)}>
              <Text className="text-lg text-brand-dark">💬</Text>
            </TouchableOpacity>
            <Text className="text-lg">↗</Text>
          </View>
          <Text className="text-lg">{post.isSavedByMe ? "🔖" : "▢"}</Text>
        </View>
        <Text className="text-sm font-semibold text-brand-dark mt-3">{likesCount} likes</Text>
        {post.caption ? (
          <Text className="text-sm text-brand-dark mt-1 leading-5">
            <Text className="font-semibold">{post.author.username} </Text>
            {post.caption}
          </Text>
        ) : null}
        <TouchableOpacity activeOpacity={0.7} onPress={() => onPressComments?.(post.id)}>
          <Text className="text-xs text-gray-500 mt-2">View all {post.commentsCount} comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
