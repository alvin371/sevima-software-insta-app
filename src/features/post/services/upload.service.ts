import { Directory, File, Paths } from "expo-file-system";
import { apiClient } from "@/shared/lib/axios";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import type { ApiResponse, UploadResponse } from "@/shared/types/api.types";
import type { CreatePostDraft } from "@/shared/types/models.types";

const isMockApiMode =
  process.env.EXPO_PUBLIC_API_MODE === "mock" || !process.env.EXPO_PUBLIC_API_URL;

function getFileName(draft: CreatePostDraft) {
  if (draft.fileName) return draft.fileName;

  const extension = draft.mimeType?.split("/")[1] ?? "jpg";
  return `post-${Date.now()}.${extension}`;
}

export async function uploadImage(draft: CreatePostDraft): Promise<UploadResponse> {
  if (isMockApiMode) {
    const fileName = getFileName(draft);
    try {
      const uploadsDir = new Directory(Paths.document, "uploads");
      if (!uploadsDir.exists) {
        uploadsDir.create({ intermediates: true });
      }
      const destFile = new File(uploadsDir, fileName);
      if (!destFile.exists) {
        new File(draft.uri).copy(destFile);
      }
      return {
        url: destFile.uri,
        key: fileName,
        mimeType: draft.mimeType ?? "image/jpeg",
        size: draft.fileSize ?? 0,
        width: draft.width,
        height: draft.height,
      };
    } catch {
      return {
        url: draft.uri,
        key: fileName,
        mimeType: draft.mimeType ?? "image/jpeg",
        size: draft.fileSize ?? 0,
        width: draft.width,
        height: draft.height,
      };
    }
  }

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
