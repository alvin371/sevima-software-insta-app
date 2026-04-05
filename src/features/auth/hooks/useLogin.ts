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
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setCurrentUser(data.user);
      queryClient.clear(); // clear any stale cache from a previous session
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
  });
}
