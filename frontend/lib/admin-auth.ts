import Cookies from 'js-cookie'
import { adminAuthAPI } from './admin-api'

export interface Admin {
  id: number
  name: string
  email: string
  role?: string
}

const ADMIN_AUTH_CHANGED_EVENT = 'admin_auth_changed'

function emitAdminAuthChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(ADMIN_AUTH_CHANGED_EVENT))
}

export const adminAuth = {
  // Check if admin is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!Cookies.get('admin_token')
  },

  // Get current admin
  getAdmin: (): Admin | null => {
    if (typeof window === 'undefined') return null
    const adminStr = Cookies.get('admin')
    if (!adminStr) return null
    try {
      return JSON.parse(adminStr)
    } catch {
      return null
    }
  },

  // Set admin auth data
  setAuth: (token: string, admin: Admin): void => {
    Cookies.set('admin_token', token, { expires: 7 }) // 7 days
    Cookies.set('admin', JSON.stringify(admin), { expires: 7 })
    emitAdminAuthChanged()
  },

  // Clear admin auth data
  clearAuth: (): void => {
    Cookies.remove('admin_token')
    Cookies.remove('admin')
    emitAdminAuthChanged()
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await adminAuthAPI.login({ email, password })
      const responseData = response.data
      
      if (!responseData.success) {
        return {
          success: false,
          error: responseData.message || 'Login failed',
        }
      }
      
      const token = responseData.token
      const admin = responseData.admin
      
      if (!token || !admin) {
        return {
          success: false,
          error: 'Invalid response from server',
        }
      }
      
      adminAuth.setAuth(token, admin)
      return { success: true, admin }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
      }
    }
  },

  // Logout
  logout: async () => {
    try {
      await adminAuthAPI.logout()
    } catch (error) {
      // Ignore errors on logout
    } finally {
      adminAuth.clearAuth()
    }
  },
}
