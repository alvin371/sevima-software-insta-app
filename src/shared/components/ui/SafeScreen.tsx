import React from "react";
import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeScreenProps extends ViewProps {
  children: React.ReactNode;
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export function SafeScreen({ children, edges = ["top", "bottom"], style, ...props }: SafeScreenProps) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-white" style={style} {...props}>
      {children}
    </SafeAreaView>
  );
}
