import { create } from 'zustand'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

export interface ToastItem {
  id: string
  title?: string
  message: string
  type: ToastType
  timeoutMs?: number
}

interface NotificationState {
  toasts: ToastItem[]
  push: (t: Omit<ToastItem, 'id'>) => string
  remove: (id: string) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = crypto.randomUUID()
    const toast: ToastItem = { id, timeoutMs: 4000, ...t }
    set(state => ({ toasts: [toast, ...state.toasts] }))
    const timeout = toast.timeoutMs ?? 0
    if (timeout > 0) {
      setTimeout(() => {
        const current = get().toasts
        if (current.some(x => x.id === id)) get().remove(id)
      }, timeout)
    }
    return id
  },
  remove: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
}))


