import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "@/shared/lib/queryClient";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useLogin() {
  const { setTokens, setCurrentUser } = useAuthStore();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Clear stale cache BEFORE setting isAuthenticated=true to prevent
      // useMe() from briefly reading a previous user's cached data
      queryClient.clear();
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setCurrentUser(data.user);
    },
  });
}
