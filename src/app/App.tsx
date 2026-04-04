// NativeWind CSS entry — must be first import (2 dirs up: src/app → src → root)
import "../../global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Providers } from "./providers";
import { RootNavigator } from "./navigation";

export function App() {
  return (
    <Providers>
      <StatusBar style="dark" />
      <RootNavigator />
    </Providers>
  );
}
