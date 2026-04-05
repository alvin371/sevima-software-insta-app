import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/profile.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.profile.detail(username),
    queryFn: () => getProfile(username),
    enabled: !!username,
    staleTime: 2 * 60_000,
  });
}
