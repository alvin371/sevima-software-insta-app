import { useMutation } from "@tanstack/react-query";
import { register } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "@/shared/lib/queryClient";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useRegister() {
  const { setTokens, setCurrentUser } = useAuthStore();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setCurrentUser(data.user);
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
  });
}
