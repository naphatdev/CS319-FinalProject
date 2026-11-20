import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReportFilters } from '../types'

// Client-only UI state. Server data lives in TanStack Query, never here.
interface UiState {
  bookmarkIds: number[]
  filters: ReportFilters
  toggleBookmark: (id: number) => void
  setFilters: (patch: Partial<ReportFilters>) => void
  resetFilters: () => void
}

const defaultFilters: ReportFilters = { search: '', status: '', categoryId: null, page: 1 }

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      bookmarkIds: [],
      filters: defaultFilters,
      toggleBookmark: (id) =>
        set((s) => ({
          bookmarkIds: s.bookmarkIds.includes(id)
            ? s.bookmarkIds.filter((b) => b !== id)
            : [...s.bookmarkIds, id],
        })),
      // changing any filter other than page resets to page 1
      setFilters: (patch) =>
        set((s) => ({
          filters: { ...s.filters, page: 1, ...patch },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'community-reports-ui',
      partialize: (s) => ({ bookmarkIds: s.bookmarkIds, filters: s.filters }),
    },
  ),
)
