import { useMutation } from "@tanstack/react-query";
import { register } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

export function useRegister() {
  const { setTokens, setCurrentUser } = useAuthStore();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setCurrentUser(data.user);
    },
  });
}
