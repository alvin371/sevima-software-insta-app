import { useQuery } from "@tanstack/react-query";
import { getPost } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => getPost(id),
    enabled: !!id,
  });
}
