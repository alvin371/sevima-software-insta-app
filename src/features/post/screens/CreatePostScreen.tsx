import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { Button } from "@/shared/components/ui/Button";
import type { CreateStackScreenProps } from "@/app/navigation/types";
import type { CreatePostDraft } from "@/shared/types/models.types";

type Props = CreateStackScreenProps<"CreatePost">;

function toDraft(asset: ImagePicker.ImagePickerAsset): CreatePostDraft {
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType,
    fileName: asset.fileName,
    fileSize: asset.fileSize,
  };
}

export function CreatePostScreen({ navigation, route }: Props) {
  const [isPicking, setIsPicking] = useState(false);
  const draft = route.params?.draft;

  const handlePickImage = async () => {
    try {
      setIsPicking(true);

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Photo access needed",
          "Allow access to your photos so you can create a post.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        quality: 0.9,
      });

      if (result.canceled || !result.assets.length) return;

      navigation.navigate("EditPost", { draft: toDraft(result.assets[0]) });
    } catch {
      Alert.alert("Could not open photos", "Try again and select an image from your device.");
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <SafeScreen>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-gray-600">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">New Post</Text>
        <View className="w-12" />
      </View>
      <View className="flex-1 items-center justify-center gap-5 px-6">
        {draft?.uri ? (
          <Image
            source={{ uri: draft.uri }}
            contentFit="cover"
            style={{ width: 220, height: 220, borderRadius: 24 }}
          />
        ) : (
          <View className="w-44 h-44 bg-gray-100 rounded-3xl items-center justify-center">
            <Text className="text-5xl text-gray-500">+</Text>
          </View>
        )}

        <View className="items-center gap-2">
          <Text className="text-gray-700 text-lg font-semibold">
            {draft?.uri ? "Photo selected" : "Choose a photo"}
          </Text>
          <Text className="text-gray-500 text-base text-center">
            {draft?.uri
              ? "Continue with your selected image or choose another one."
              : "Select one image from your local device to start a new post."}
          </Text>
        </View>

        <View className="w-full gap-3">
          <Button
            label={draft?.uri ? "Choose Another Photo" : "Select From Device"}
            size="full"
            isLoading={isPicking}
            onPress={() => {
              void handlePickImage();
            }}
          />
          {draft?.uri ? (
            <Button
              label="Continue"
              variant="outline"
              size="full"
              onPress={() => navigation.navigate("EditPost", { draft })}
            />
          ) : null}
        </View>
      </View>
    </SafeScreen>
  );
}
