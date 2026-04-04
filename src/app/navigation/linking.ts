import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "./types";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["instaapp://", "https://instaapp.com"],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: "login",
          Register: "register",
          ForgotPassword: "forgot-password",
        },
      },
      App: {
        screens: {
          FeedTab: {
            screens: {
              Feed: "home",
              PostDetail: "post/:postId",
              UserProfile: "user/:username",
            },
          },
          SearchTab: {
            screens: {
              Search: "search",
              Explore: "explore",
            },
          },
          ProfileTab: {
            screens: {
              Profile: "profile/:username?",
              EditProfile: "profile/edit",
              Settings: "settings",
            },
          },
        },
      },
    },
  },
};
