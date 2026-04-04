import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { getAvatarFallbackColor } from "@/shared/utils/image";
import { getInitials } from "@/shared/utils/string";
import { avatarSize } from "@/shared/constants/dimensions";

type AvatarSizeKey = keyof typeof avatarSize;

interface AvatarProps {
  uri?: string | null;
  username: string;
  size?: AvatarSizeKey;
}

export function Avatar({ uri, username, size = "md" }: AvatarProps) {
  const dimension = avatarSize[size];
  const fallbackColor = getAvatarFallbackColor(username);
  const initials = getInitials(username);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        backgroundColor: fallbackColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: dimension * 0.35 }}>
        {initials}
      </Text>
    </View>
  );
}
