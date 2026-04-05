import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../services/profile.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { UpdateProfileDto, User } from "@/shared/types/models.types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const currentUser = useAuthStore((state) => state.currentUser);

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => updateProfile(dto),
    onSuccess: (user: User) => {
      setCurrentUser(user);
      queryClient.setQueryData(queryKeys.auth.me(), user);
      queryClient.setQueryData(queryKeys.profile.detail(user.username), user);

      if (currentUser?.username && currentUser.username !== user.username) {
        queryClient.removeQueries({ queryKey: queryKeys.profile.detail(currentUser.username) });
        queryClient.removeQueries({ queryKey: queryKeys.profile.posts(currentUser.username) });
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
  });
}
