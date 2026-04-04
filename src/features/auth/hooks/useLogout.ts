import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "@/shared/lib/queryClient";

export function useLogout() {
  const { clearAuth, refreshToken } = useAuthStore();

  return useMutation({
    mutationFn: () => logout(refreshToken ?? ""),
    onSettled: () => {
      // Always clear local state even if the API call fails
      clearAuth();
      queryClient.clear();
    },
  });
}
