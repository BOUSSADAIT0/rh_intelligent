import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Role = 'admin' | 'recruteur' | 'candidat'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  login: async (email: string, _password: string) => {
    const fakeRole: Role = email.includes('admin') ? 'admin' : email.includes('recruteur') ? 'recruteur' : 'candidat'
    const user: User = { id: 'u_' + crypto.randomUUID(), name: email.split('@')[0], email, role: fakeRole }
    set({ user })
  },
  logout: () => set({ user: null })
}), { name: 'auth-store' }))


