import React from "react";
import { View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeScreenProps extends ViewProps {
  children: React.ReactNode;
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export function SafeScreen({ children, edges = ["top", "bottom"], style, ...props }: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  const baseStyle: StyleProp<ViewStyle> = [
    {
      flex: 1,
      backgroundColor: "#FFFFFF",
      paddingTop: edges.includes("top") ? insets.top : 0,
      paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
      paddingLeft: edges.includes("left") ? insets.left : 0,
      paddingRight: edges.includes("right") ? insets.right : 0,
    },
    style,
  ];

  return (
    <View style={baseStyle} {...props}>
      {children}
    </View>
  );
}
