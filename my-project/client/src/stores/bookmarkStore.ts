import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkState {
    ids: number[];
    toggle: (id: number) => void;
}

export const useBookmarkStore = create<BookmarkState>()(
    persist(
        (set) => ({
            ids: [],
            toggle: (id) =>
                set((state) => ({
                    ids: state.ids.includes(id)
                        ? state.ids.filter((x) => x !== id)
                        : [...state.ids, id],
                })),
        }),
        { name: "bookmarks" },
    ),
);