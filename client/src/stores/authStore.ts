import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Only the JWT lives here (client credential). The user profile is server data -> TanStack Query (useMe).
interface AuthState {
  token: string | null
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    { name: 'community-reports-auth' },
  ),
)
