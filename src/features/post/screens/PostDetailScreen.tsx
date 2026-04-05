import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Avatar } from "@/shared/components/ui/Avatar";
import { timeAgo } from "@/shared/utils/date";
import { getPostImageHeight } from "@/shared/utils/image";
import { usePost, useLikePost, useComments, useAddComment, useDeleteComment, useLikeComment, useUpdateComment } from "@/features/post";
import { useMe } from "@/features/auth/hooks/useMe";
import type { FeedStackParamList } from "@/app/navigation/types";
import type { Comment } from "@/shared/types/models.types";
import { getPreviewCommentsByPostId, isPreviewPostId } from "@/shared/mocks/screenPreview";

type PostDetailRoute = RouteProp<FeedStackParamList, "PostDetail">;

type FlattenedComment = Comment & { depth: number };

function isComment(value: unknown): value is Comment {
  return typeof value === "object" && value !== null && "id" in value && "author" in value;
}

function flattenComments(comments: Comment[] | undefined, depth = 0): FlattenedComment[] {
  if (!comments?.length) return [];

  return comments.flatMap((comment) => {
    if (!isComment(comment)) return [];

    return [
      { ...comment, depth },
      ...(comment.replies ? flattenComments(comment.replies, depth + 1) : []),
    ];
  });
}

function updatePreviewCommentTree(
  comments: Comment[],
  commentId: string,
  updater: (comment: Comment) => Comment | null,
): Comment[] {
  return comments.flatMap((comment) => {
    if (comment.id === commentId) {
      const updated = updater(comment);
      return updated ? [updated] : [];
    }

    return [
      {
        ...comment,
        replies: comment.replies
          ? updatePreviewCommentTree(comment.replies, commentId, updater)
          : comment.replies,
      },
    ];
  });
}

export function PostDetailScreen() {
  const route = useRoute<PostDetailRoute>();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { postId } = route.params;
  const postQuery = usePost(postId);
  const commentsQuery = useComments(postId);
  const meQuery = useMe();
  const likePostMutation = useLikePost();
  const addCommentMutation = useAddComment(postId);
  const updateCommentMutation = useUpdateComment(postId);
  const deleteCommentMutation = useDeleteComment(postId);
  const likeCommentMutation = useLikeComment(postId);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [previewPostState, setPreviewPostState] = useState(postQuery.data ?? null);
  const [previewComments, setPreviewComments] = useState<Comment[]>([]);

  const isPreviewPost = isPreviewPostId(postId);
  const post = isPreviewPost ? previewPostState ?? postQuery.data : postQuery.data;
  const flattenedComments = useMemo(
    () =>
      flattenComments(
        isPreviewPost
          ? previewComments
          : (commentsQuery.data?.pages.flatMap((page) => page.data) ?? []),
      ),
    [commentsQuery.data?.pages, isPreviewPost, previewComments],
  );
  const currentUserId = meQuery.data?.id;
  const isSubmittingComment = addCommentMutation.isPending || updateCommentMutation.isPending;
  const composerLabel = editingCommentId ? "Save" : "Post";

  const imageHeight = post
    ? getPostImageHeight(post.media[0]?.width ?? 1080, post.media[0]?.height ?? 1080, width)
    : width;

  useEffect(() => {
    if (!isPreviewPost) return;
    setPreviewPostState(postQuery.data ?? null);
    setPreviewComments(getPreviewCommentsByPostId(postId));
  }, [isPreviewPost, postId, postQuery.data]);

  const resetComposer = () => {
    setCommentText("");
    setEditingCommentId(null);
  };

  const submitComment = () => {
    const nextText = commentText.trim();
    if (!nextText) return;

    if (isPreviewPost) {
      if (editingCommentId) {
        setPreviewComments((current) =>
          updatePreviewCommentTree(current, editingCommentId, (comment) => ({
            ...comment,
            text: nextText,
          })),
        );
      } else if (currentUserId && meQuery.data) {
        setPreviewComments((current) => [
          {
            id: `${postId}_local_${Date.now()}`,
            postId,
            author: meQuery.data,
            text: nextText,
            likesCount: 0,
            isLikedByMe: false,
            repliesCount: 0,
            parentId: null,
            createdAt: new Date().toISOString(),
          },
          ...current,
        ]);
        setPreviewPostState((current) =>
          current ? { ...current, commentsCount: current.commentsCount + 1 } : current,
        );
      }

      resetComposer();
      return;
    }

    if (editingCommentId) {
      updateCommentMutation.mutate(
        { commentId: editingCommentId, text: nextText },
        {
          onSuccess: () => resetComposer(),
        },
      );
      return;
    }

    addCommentMutation.mutate(nextText, {
      onSuccess: () => {
        setCommentText("");
      },
    });
  };

  const openCommentActions = (comment: FlattenedComment) => {
    if (!currentUserId || comment.author.id !== currentUserId) return;

    Alert.alert("Comment actions", "Manage your comment.", [
      {
        text: "Edit",
        onPress: () => {
          setEditingCommentId(comment.id);
          setCommentText(comment.text);
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Delete comment", "This action cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                if (isPreviewPost) {
                  setPreviewComments((current) =>
                    updatePreviewCommentTree(current, comment.id, () => null),
                  );
                  setPreviewPostState((current) =>
                    current ? { ...current, commentsCount: Math.max(current.commentsCount - 1, 0) } : current,
                  );
                  if (editingCommentId === comment.id) {
                    resetComposer();
                  }
                  return;
                }

                deleteCommentMutation.mutate(comment.id);
              },
            },
          ]);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  if (postQuery.isLoading) {
    return (
      <SafeScreen>
        <LoadingSpinner fullScreen />
      </SafeScreen>
    );
  }

  if (postQuery.isError || !post) {
    return (
      <SafeScreen>
        <EmptyState
          title="Could not load post"
          description="Try again once the API is reachable."
          actionLabel="Retry"
          onAction={() => {
            void postQuery.refetch();
          }}
        />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-brand-dark text-base">‹ Back</Text>
          </TouchableOpacity>
          <Text className="text-base font-semibold text-brand-dark ml-4">Post</Text>
        </View>

        <FlatList
          data={flattenedComments}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
              void commentsQuery.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.35}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <View>
              <View className="px-4 pt-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Avatar uri={post.author.avatarUrl} username={post.author.username} />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-semibold text-brand-dark">{post.author.username}</Text>
                      {post.location ? (
                        <Text className="text-xs text-gray-500 mt-0.5">{post.location}</Text>
                      ) : null}
                    </View>
                  </View>
                  <Text className="text-lg text-gray-500">⋯</Text>
                </View>
              </View>

              <Image
                source={{ uri: post.media[0]?.url }}
                style={{ width, height: imageHeight, backgroundColor: "#F3F4F6", marginTop: 16 }}
                contentFit="cover"
                transition={150}
              />

              <View className="px-4 pt-4 pb-5 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                      activeOpacity={0.7}
                      disabled={!isPreviewPost && likePostMutation.isPending}
                      onPress={() => {
                        if (isPreviewPost) {
                          setPreviewPostState((current) =>
                            current
                              ? {
                                  ...current,
                                  isLikedByMe: !current.isLikedByMe,
                                  likesCount: current.isLikedByMe
                                    ? Math.max(current.likesCount - 1, 0)
                                    : current.likesCount + 1,
                                }
                              : current,
                          );
                          return;
                        }

                        likePostMutation.mutate({ postId: post.id, isLiked: post.isLikedByMe });
                      }}
                    >
                      <Text className={post.isLikedByMe ? "text-xl text-brand-primary" : "text-xl text-brand-dark"}>
                        {post.isLikedByMe ? "♥" : "♡"}
                      </Text>
                    </TouchableOpacity>
                    <Text className="text-xl text-brand-dark">💬</Text>
                    <Text className="text-xl text-brand-dark">↗</Text>
                  </View>
                  <Text className="text-lg">{post.isSavedByMe ? "🔖" : "▢"}</Text>
                </View>

                <Text className="text-sm font-semibold text-brand-dark mt-4">{post.likesCount} likes</Text>
                {post.caption ? (
                  <Text className="text-sm text-brand-dark mt-2 leading-5">
                    <Text className="font-semibold">{post.author.username} </Text>
                    {post.caption}
                  </Text>
                ) : null}
                <Text className="text-xs text-gray-500 mt-2">{timeAgo(post.createdAt)}</Text>
              </View>

              <View className="px-4 pt-4 pb-2">
                <Text className="text-sm font-semibold text-brand-dark">Comments</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            commentsQuery.isLoading ? (
              <View className="py-8">
                <LoadingSpinner />
              </View>
            ) : (
              <EmptyState
                title="No comments yet"
                description="Start the conversation on this post."
              />
            )
          }
          ListFooterComponent={
            commentsQuery.isFetchingNextPage ? (
              <View className="py-5">
                <LoadingSpinner />
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const canManage = currentUserId === item.author.id;

            return (
              <TouchableOpacity
                activeOpacity={canManage ? 0.7 : 1}
                disabled={!canManage}
                onLongPress={() => openCommentActions(item)}
                className="px-4 py-3"
                style={{ paddingLeft: 16 + item.depth * 28 }}
              >
                <View className="flex-row">
                  <Avatar uri={item.author.avatarUrl} username={item.author.username} size="sm" />
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-3">
                        <Text className="text-sm text-brand-dark leading-5">
                          <Text className="font-semibold">{item.author.username} </Text>
                          {item.text}
                        </Text>
                        <View className="flex-row items-center mt-2 gap-3">
                          <Text className="text-[11px] text-gray-500">{timeAgo(item.createdAt)}</Text>
                          <Text className="text-[11px] text-gray-500">{item.likesCount} likes</Text>
                          {canManage ? (
                            <Text className="text-[11px] font-semibold text-gray-400">Long press</Text>
                          ) : null}
                        </View>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={!isPreviewPost && likeCommentMutation.isPending}
                        onPress={() => {
                          if (isPreviewPost) {
                            setPreviewComments((current) =>
                              updatePreviewCommentTree(current, item.id, (comment) => ({
                                ...comment,
                                isLikedByMe: !comment.isLikedByMe,
                                likesCount: comment.isLikedByMe
                                  ? Math.max(comment.likesCount - 1, 0)
                                  : comment.likesCount + 1,
                              })),
                            );
                            return;
                          }

                          likeCommentMutation.mutate({
                            commentId: item.id,
                            isLiked: item.isLikedByMe,
                          });
                        }}
                      >
                        <Text
                          className={item.isLikedByMe ? "text-base text-brand-primary" : "text-base text-gray-400"}
                        >
                          {item.isLikedByMe ? "♥" : "♡"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        <View className="border-t border-gray-200 px-4 pt-3 pb-2">
          {editingCommentId ? (
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-semibold text-brand-primary">Editing comment</Text>
              <TouchableOpacity onPress={resetComposer}>
                <Text className="text-xs font-semibold text-gray-500">Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View className="flex-row items-end gap-3">
            <View className="flex-1 rounded-2xl bg-gray-100 px-4 py-3">
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment"
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={280}
                className="text-sm text-brand-dark"
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={!commentText.trim() || isSubmittingComment}
              onPress={submitComment}
              className="pb-3"
            >
              <Text
                className={
                  !commentText.trim() || isSubmittingComment
                    ? "text-sm font-semibold text-gray-300"
                    : "text-sm font-semibold text-brand-primary"
                }
              >
                {isSubmittingComment ? "..." : composerLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
