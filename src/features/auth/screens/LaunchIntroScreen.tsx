import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";

const AnimatedView = Animated.createAnimatedComponent(View);

const introTheme = {
  background: "#faf7f8",
  frameBorder: "rgba(109, 94, 110, 0.12)",
  cardBorder: "rgba(118, 102, 120, 0.12)",
  shadow: "rgba(125, 111, 128, 0.08)",
  title: "#322d35",
  subtitle: "#b8afb6",
  dot: "#c6c2c8",
  dotActive: "#9a969d",
  line: "rgba(180, 175, 184, 0.45)",
} as const;

interface LaunchIntroScreenProps {
  onFinish: () => void;
}

function BackgroundGlow() {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFillObject} viewBox="0 0 100 100" preserveAspectRatio="none">
      <Defs>
        <RadialGradient id="topGlow" cx="28%" cy="14%" r="46%">
          <Stop offset="0%" stopColor="#f6e8ea" stopOpacity="0.95" />
          <Stop offset="60%" stopColor="#f2ebf7" stopOpacity="0.36" />
          <Stop offset="100%" stopColor="#f8f5f7" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="bottomGlow" cx="72%" cy="92%" r="42%">
          <Stop offset="0%" stopColor="#e4eef0" stopOpacity="0.86" />
          <Stop offset="58%" stopColor="#eef3f5" stopOpacity="0.28" />
          <Stop offset="100%" stopColor="#f8f5f7" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width="100" height="100" fill={introTheme.background} />
      <Ellipse cx="26" cy="10" rx="36" ry="22" fill="url(#topGlow)" />
      <Ellipse cx="78" cy="94" rx="32" ry="18" fill="url(#bottomGlow)" />
    </Svg>
  );
}

function InstaAppMark() {
  return (
    <Svg width={52} height={52} viewBox="0 0 52 52" fill="none">
      <Defs>
        <LinearGradient id="stroke" x1="9" y1="8" x2="43" y2="43" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#6d6468" />
          <Stop offset="1" stopColor="#867d81" />
        </LinearGradient>
      </Defs>
      <Path
        d="M31.6 10.8c-8.5 0-15.4 6.9-15.4 15.4v9"
        stroke="url(#stroke)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M33.1 15.2c-3.7.8-6.9 3.7-8.3 7.4 3.4-.2 6.7 1.2 9 3.8"
        stroke="url(#stroke)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M26.3 18.4c3.1 0 5.9 1.9 7 4.7"
        stroke="url(#stroke)"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M26.4 26.3c0 4.8 3.7 8.6 8.5 8.6"
        stroke="url(#stroke)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path
        d="M36 17.4c2.7 2.3 4.5 5.9 4.5 9.9"
        stroke="url(#stroke)"
        strokeWidth={2.8}
        strokeLinecap="round"
      />
      <Circle cx={39.7} cy={12.2} r={1.8} fill="#8c8388" />
      <Circle cx={41.6} cy={34.3} r={1.4} fill="#a79ea4" />
      <Circle cx={16.3} cy={37.2} r={1.5} fill="#c3bcc1" />
    </Svg>
  );
}

export function LaunchIntroScreen({ onFinish }: LaunchIntroScreenProps) {
  const { height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(14)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const finishedRef = useRef(false);

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 900,
        delay: 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    entrance.start();

    const finishTimer = setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinish();
      }
    }, 2400);

    return () => {
      clearTimeout(finishTimer);
      entrance.stop();
    };
  }, [fadeAnim, footerAnim, onFinish, translateAnim]);

  const titleTopSpacer = Math.max(height * 0.29, 200);
  const dotsBottomSpacer = Math.max(height * 0.17, 108);

  return (
    <SafeScreen edges={["top", "bottom"]} style={{ backgroundColor: introTheme.background }}>
      <View style={styles.container}>
        <BackgroundGlow />

        <AnimatedView
          style={[
            styles.hero,
            {
              paddingTop: titleTopSpacer,
              opacity: fadeAnim,
              transform: [{ translateY: translateAnim }],
            },
          ]}
        >
          <View style={styles.logoWrap}>
            <View style={styles.logoShadowCard} />
            <View style={styles.logoCard}>
              <View style={styles.logoInset}>
                <InstaAppMark />
              </View>
            </View>
            <View style={[styles.accentDot, styles.leftDot]} />
            <View style={[styles.accentDot, styles.topRightDot]} />
          </View>

          <Text style={styles.title}>Insta App</Text>
          <Text style={styles.subtitle}>STEP INTO THE GALLERY OF THE FUTURE.</Text>
        </AnimatedView>

        <AnimatedView
          style={[
            styles.footer,
            {
              paddingBottom: dotsBottomSpacer,
              opacity: footerAnim,
              transform: [{ translateY: Animated.multiply(translateAnim, 0.55) }],
            },
          ]}
        >
          <View style={styles.pagination}>
            <View style={[styles.paginationDot, styles.paginationDotActive]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
          <View style={styles.paginationLine} />
        </AnimatedView>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  accentDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d7d0d4",
  },
  container: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  leftDot: {
    left: -12,
    top: 29,
    backgroundColor: "#d1cbd0",
  },
  logoCard: {
    width: 92,
    height: 92,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: introTheme.cardBorder,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoInset: {
    width: 76,
    height: 76,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: introTheme.frameBorder,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoShadowCard: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    shadowColor: introTheme.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 2,
  },
  logoWrap: {
    position: "relative",
    marginBottom: 38,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  paginationDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: introTheme.dot,
  },
  paginationDotActive: {
    backgroundColor: introTheme.dotActive,
  },
  paginationLine: {
    width: 28,
    height: 2,
    borderRadius: 999,
    backgroundColor: introTheme.line,
    marginTop: 14,
  },
  subtitle: {
    color: introTheme.subtitle,
    fontSize: 10,
    letterSpacing: 4.2,
    textAlign: "center",
    marginTop: 16,
  },
  title: {
    color: introTheme.title,
    fontSize: 48,
    lineHeight: 56,
    fontStyle: "italic",
    fontFamily: "serif",
    letterSpacing: -1.2,
  },
  topRightDot: {
    right: -3,
    top: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#e4cad2",
  },
});
