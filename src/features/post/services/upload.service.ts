import { apiClient } from "@/shared/lib/axios";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { ApiResponse, UploadResponse } from "@/shared/types/api.types";
import type { CreatePostDraft } from "@/shared/types/models.types";

function getFileName(draft: CreatePostDraft) {
  if (draft.fileName) return draft.fileName;

  const extension = draft.mimeType?.split("/")[1] ?? "jpg";
  return `post-${Date.now()}.${extension}`;
}

export async function uploadImage(draft: CreatePostDraft): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: draft.uri,
    name: getFileName(draft),
    type: draft.mimeType ?? "image/jpeg",
  } as never);

  const { data } = await apiClient.post<ApiResponse<UploadResponse>>(
    ENDPOINTS.UPLOAD.IMAGE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.data;
}
