import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function getPostImageHeight(
  imageWidth: number,
  imageHeight: number,
  containerWidth = SCREEN_WIDTH,
): number {
  if (!imageWidth || !imageHeight) return containerWidth;
  const ratio = imageHeight / imageWidth;
  return Math.min(containerWidth * ratio, containerWidth * 1.25); // max 5:4 aspect
}

export function isValidImageUri(uri: string): boolean {
  return uri.startsWith("http://") || uri.startsWith("https://") || uri.startsWith("file://");
}

export function getAvatarFallbackColor(username: string): string {
  const colors = [
    "#E1306C", "#833AB4", "#FCAF45", "#0095F6",
    "#00B2FF", "#F77737", "#C13584", "#5851DB",
  ];
  const index =
    username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}
