'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  phone: string | null
  address: string | null
  subdivision: string | null
  role: 'CLIENT' | 'PHARMACY' | 'RIDER' | 'ADMIN'
}

interface Profile {
  id?: string
  name?: string
  address?: string
  phone?: string
  // Pharmacy specific
  licenseNumber?: string
  // Rider specific
  vehicleType?: string
  isAvailable?: boolean
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  role?: string
  pharmacyName?: string
  pharmacyAddress?: string
  subdivision?: string
  vehicleType?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken()
      if (token) {
        try {
          const data = await api.getProfile()
          setUser(data.user)
          setProfile(data.profile)
        } catch (error) {
          // Token is invalid, clear it
          api.logout()
          setUser(null)
          setProfile(null)
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password)
    setUser(data.user)
    setProfile(data.profile)
    
    // Redirect based on role
    switch (data.user.role) {
      case 'PHARMACY':
        router.push('/pharmacy')
        break
      case 'RIDER':
        router.push('/rider')
        break
      case 'ADMIN':
        router.push('/admin')
        break
      default:
        router.push('/dashboard')
    }
  }

  const register = async (userData: RegisterData) => {
    const data = await api.register(userData)
    setUser(data.user)
    setProfile(data.profile)
    
    // Redirect based on role
    switch (data.user.role) {
      case 'PHARMACY':
        router.push('/pharmacy')
        break
      case 'RIDER':
        router.push('/rider')
        break
      default:
        router.push('/dashboard')
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
    setProfile(null)
    router.push('/')
  }

  const refreshProfile = async () => {
    try {
      const data = await api.getProfile()
      setUser(data.user)
      setProfile(data.profile)
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
