import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { queryKeys } from "@/shared/constants/queryKeys";

export function useMe() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getMe,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (query.data) {
      setCurrentUser(query.data);
    }
  }, [query.data, setCurrentUser]);

  return query;
}
