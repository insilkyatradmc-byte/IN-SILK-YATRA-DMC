import Cookies from 'js-cookie'
import { authAPI } from './api'

export interface User {
  id: number
  name: string
  email: string
  role?: string
}

const AUTH_CHANGED_EVENT = 'auth_changed'

function emitAuthChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export const auth = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!Cookies.get('auth_token')
  },

  // Get current user
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const userStr = Cookies.get('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  // Set auth data
  setAuth: (token: string, user: User): void => {
    Cookies.set('auth_token', token, { expires: 7 }) // 7 days
    Cookies.set('user', JSON.stringify(user), { expires: 7 })
    emitAuthChanged()
  },

  // Clear auth data
  clearAuth: (): void => {
    Cookies.remove('auth_token')
    Cookies.remove('user')
    emitAuthChanged()
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      const { token, user } = response.data
      auth.setAuth(token, user)
      return { success: true, user }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      }
    }
  },

  // Register
  register: async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await authAPI.register({ name, email, password, password_confirmation })
      const { token, user } = response.data
      auth.setAuth(token, user)
      return { success: true, user }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      }
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Ignore errors on logout
    } finally {
      auth.clearAuth()
    }
  },
}
