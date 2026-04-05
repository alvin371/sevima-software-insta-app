import { useQuery } from "@tanstack/react-query";
import { getExplore } from "../services/search.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useExplore() {
  return useQuery({
    queryKey: queryKeys.search.explore(),
    queryFn: getExplore,
    staleTime: 5 * 60_000,
  });
}
