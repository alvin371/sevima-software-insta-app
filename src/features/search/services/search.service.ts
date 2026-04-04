import { apiClient } from "@/shared/lib/axios";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { PostPreview, User } from "@/shared/types/models.types";

export interface SearchResults {
  users: User[];
  posts: PostPreview[];
}

export async function search(query: string): Promise<SearchResults> {
  const { data } = await apiClient.get<SearchResults>(ENDPOINTS.SEARCH.QUERY, {
    params: { q: query },
  });
  return data;
}

export async function getExplore(): Promise<PostPreview[]> {
  const { data } = await apiClient.get<PostPreview[]>(ENDPOINTS.SEARCH.EXPLORE);
  return data;
}
