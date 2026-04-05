import { useQuery } from "@tanstack/react-query";
import { getPost } from "../services/post.service";
import { queryKeys } from "@/shared/constants/queryKeys";
import { getPreviewPostById, isPreviewPostId } from "@/shared/mocks/screenPreview";

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: async () => {
      if (isPreviewPostId(id)) {
        const previewPost = getPreviewPostById(id);
        if (!previewPost) {
          throw new Error(`Preview post not found: ${id}`);
        }
        return previewPost;
      }

      return getPost(id);
    },
    enabled: !!id,
  });
}
