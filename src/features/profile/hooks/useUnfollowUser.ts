import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowUser } from "../services/profile.service";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { User } from "@/shared/types/models.types";

export function useUnfollowUser(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unfollowUser(username),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile.detail(username) });

      const previousProfile = queryClient.getQueryData<User>(queryKeys.profile.detail(username));

      queryClient.setQueryData<User>(queryKeys.profile.detail(username), (old) => {
        if (!old) return old;
        return {
          ...old,
          isFollowedByMe: false,
          followersCount: Math.max(0, old.followersCount - 1),
        };
      });

      return { previousProfile };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.profile.detail(username), context.previousProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail(username) });
    },
  });
}
