import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "@/shared/lib/queryClient";

export function useLogin() {
  const { setTokens, setCurrentUser } = useAuthStore();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setCurrentUser(data.user);
      queryClient.clear(); // clear any stale cache from a previous session
    },
  });
}
