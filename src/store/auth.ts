import { create } from 'zustand'
import { User, UserRole } from '@/types'

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  isAuthenticated: () => boolean
  hasRole: (role: UserRole) => boolean
  isAdmin: () => boolean
  isPharmacy: () => boolean
  isClient: () => boolean
  isRider: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  
  isAuthenticated: () => get().user !== null,
  
  hasRole: (role) => get().user?.role === role,
  
  isAdmin: () => get().user?.role === 'ADMIN',
  isPharmacy: () => get().user?.role === 'PHARMACY',
  isClient: () => get().user?.role === 'CLIENT',
  isRider: () => get().user?.role === 'RIDER',
}))
