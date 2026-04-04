import { QueryClient, onlineManager } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";

// Keep React Query in sync with device network status
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,           // 1 min — data stays fresh for 1 min
      gcTime: 5 * 60_000,          // 5 min — unused cache is garbage collected after 5 min
      retry: 2,
      retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 30_000),
      refetchOnWindowFocus: false, // React Native has no "windows"
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0, // Do not retry mutations by default
    },
  },
});
