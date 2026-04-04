import { create } from "zustand";

type BottomSheetContent = "comments" | "postOptions" | "shareOptions" | "likesList" | null;

interface UIState {
  // Bottom sheet
  isBottomSheetOpen: boolean;
  bottomSheetContent: BottomSheetContent;
  activePostId: string | null;
  openBottomSheet: (content: NonNullable<BottomSheetContent>, postId?: string) => void;
  closeBottomSheet: () => void;

  // Toast
  toastMessage: string | null;
  toastType: "success" | "error" | "info";
  showToast: (message: string, type?: UIState["toastType"]) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isBottomSheetOpen: false,
  bottomSheetContent: null,
  activePostId: null,

  openBottomSheet: (content, postId) =>
    set({ isBottomSheetOpen: true, bottomSheetContent: content, activePostId: postId ?? null }),

  closeBottomSheet: () =>
    set({ isBottomSheetOpen: false, bottomSheetContent: null, activePostId: null }),

  toastMessage: null,
  toastType: "info",

  showToast: (message, type = "info") => set({ toastMessage: message, toastType: type }),
  hideToast: () => set({ toastMessage: null }),
}));
