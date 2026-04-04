import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// ─── Auth Stack ───────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// ─── Feed Stack ───────────────────────────────────────────────────────────────

export type FeedStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
  UserProfile: { username: string };
};

// ─── Search Stack ─────────────────────────────────────────────────────────────

export type SearchStackParamList = {
  Search: undefined;
  Explore: undefined;
  PostDetail: { postId: string };
  UserProfile: { username: string };
};

// ─── Create Stack ─────────────────────────────────────────────────────────────

export type CreateStackParamList = {
  CreatePost: undefined;
  EditPost: { uri: string };
  Caption: { uri: string; filteredUri?: string };
};

// ─── Activity Stack ───────────────────────────────────────────────────────────

export type ActivityStackParamList = {
  Notifications: undefined;
  PostDetail: { postId: string };
  UserProfile: { username: string };
};

// ─── Profile Stack ────────────────────────────────────────────────────────────

export type ProfileStackParamList = {
  Profile: { username?: string };
  EditProfile: undefined;
  Followers: { username: string };
  Following: { username: string };
  PostDetail: { postId: string };
  Settings: undefined;
  AccountSettings: undefined;
  PrivacySettings: undefined;
};

// ─── Bottom Tab ───────────────────────────────────────────────────────────────

export type AppTabParamList = {
  FeedTab: NavigatorScreenParams<FeedStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  CreateTab: NavigatorScreenParams<CreateStackParamList>;
  ActivityTab: NavigatorScreenParams<ActivityStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ─── Root (top-level) ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};

// ─── Typed screen props helpers ───────────────────────────────────────────────

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AppTabScreenProps<T extends keyof AppTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type FeedStackScreenProps<T extends keyof FeedStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<FeedStackParamList, T>,
  AppTabScreenProps<"FeedTab">
>;

export type SearchStackScreenProps<T extends keyof SearchStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, T>,
  AppTabScreenProps<"SearchTab">
>;

export type CreateStackScreenProps<T extends keyof CreateStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<CreateStackParamList, T>,
  AppTabScreenProps<"CreateTab">
>;

export type ActivityStackScreenProps<T extends keyof ActivityStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ActivityStackParamList, T>,
  AppTabScreenProps<"ActivityTab">
>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  AppTabScreenProps<"ProfileTab">
>;

// ─── Global type augmentation for useNavigation without generic ───────────────

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
