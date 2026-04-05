import React, { useMemo, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import type { CreateStackScreenProps } from "@/app/navigation/types";
import type { CreatePostDraft } from "@/shared/types/models.types";
import { captionSchema } from "@/shared/utils/validation";
import { useCreatePost } from "../hooks/useCreatePost";
import { uploadImage } from "../services/upload.service";

type Props = CreateStackScreenProps<"Caption">;

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Please try again.";
}

export function CaptionScreen({ navigation, route }: Props) {
  const createPostMutation = useCreatePost();
  const draft = route.params.draft;
  const [caption, setCaption] = useState(draft.caption ?? "");
  const [location, setLocation] = useState(draft.location ?? "");
  const [isUploading, setIsUploading] = useState(false);

  const nextDraft = useMemo<CreatePostDraft>(
    () => ({
      ...draft,
      caption,
      location,
    }),
    [caption, draft, location],
  );

  const isSubmitting = isUploading || createPostMutation.isPending;

  const handleShare = async () => {
    const parsed = captionSchema.safeParse({
      caption: caption || undefined,
      location: location || undefined,
    });

    if (!parsed.success) {
      Alert.alert(
        "Invalid post details",
        parsed.error.issues[0]?.message ?? "Please check the form.",
      );
      return;
    }

    try {
      setIsUploading(true);
      const upload = await uploadImage(draft);
      const post = await createPostMutation.mutateAsync({
        mediaUris: [upload.url],
        caption: parsed.data.caption,
        location: parsed.data.location,
      });

      const tabNavigation = navigation.getParent();
      tabNavigation?.navigate("CreateTab", { screen: "CreatePost" });
      tabNavigation?.navigate("FeedTab", {
        screen: "PostDetail",
        params: { postId: post.id },
      });
    } catch (error) {
      Alert.alert("Could not share post", getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeScreen>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          disabled={isSubmitting}
          onPress={() => navigation.navigate("EditPost", { draft: nextDraft })}
        >
          <Text className="text-base text-gray-600">Back</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">New Post</Text>
        <TouchableOpacity
          disabled={isSubmitting}
          onPress={() => {
            void handleShare();
          }}
        >
          <Text className="text-brand-primary font-semibold text-base">
            {isSubmitting ? "Sharing..." : "Share"}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-start gap-3 mb-4">
          <Image
            source={{ uri: draft.uri }}
            contentFit="cover"
            style={{ width: 64, height: 64, borderRadius: 12 }}
          />
          <TextInput
            className="flex-1 text-base text-brand-dark"
            placeholder="Write a caption..."
            multiline
            maxLength={2200}
            editable={!isSubmitting}
            value={caption}
            onChangeText={setCaption}
          />
        </View>
        <View className="border-t border-gray-200 py-3">
          <Text className="text-gray-400 text-sm mb-2">Add location</Text>
          <TextInput
            className="text-base text-brand-dark"
            placeholder="Where was this taken?"
            editable={!isSubmitting}
            value={location}
            onChangeText={setLocation}
          />
        </View>
        <View className="border-t border-gray-200 py-3">
          <Text className="text-gray-400 text-sm">
            Your image uploads first, then the post is created.
          </Text>
        </View>
      </View>
    </SafeScreen>
  );
}
