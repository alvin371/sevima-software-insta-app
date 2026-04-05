import { useQuery } from "@tanstack/react-query";
import { search } from "../services/search.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useSearch(query: string) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: queryKeys.search.results(normalizedQuery),
    queryFn: () => search(normalizedQuery),
    enabled: normalizedQuery.length > 0,
    staleTime: 30_000,
  });
}
