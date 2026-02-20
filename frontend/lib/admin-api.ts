import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Separate axios instance for admin API (uses Sanctum tokens)
const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 10000, // 10 second timeout
})

// Request interceptor to add admin auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Auto-handle FormData content type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear admin token and redirect to admin login
      Cookies.remove('admin_token')
      Cookies.remove('admin')
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('admin_auth_changed'))
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default adminApi

// Admin Auth API
export const adminAuthAPI = {
  login: (data: { email: string; password: string }) =>
    adminApi.post('/login', data),
  logout: () => adminApi.post('/logout'),
}

// Admin Dashboard API
export const adminDashboardAPI = {
  getStats: () => adminApi.get('/dashboard'),
}

// Admin Tours API
export const adminToursAPI = {
  getAll: () => adminApi.get('/tours'),
  getById: (id: number) => adminApi.get(`/tours/${id}`),
  create: (data: any) => adminApi.post('/tours', data),
  update: (id: number, data: any) => adminApi.post(`/tours/${id}`, data),
  delete: (id: number) => adminApi.delete(`/tours/${id}`),
}

// Admin Destinations API
export const adminDestinationsAPI = {
  getAll: () => adminApi.get('/destinations'),
  getById: (id: number) => adminApi.get(`/destinations/${id}`),
  create: (data: any) => adminApi.post('/destinations', data),
  update: (id: number, data: any) => adminApi.post(`/destinations/${id}`, data),
  delete: (id: number) => adminApi.delete(`/destinations/${id}`),
}

// Admin Testimonials API
export const adminTestimonialsAPI = {
  getAll: () => adminApi.get('/testimonials'),
  getById: (id: number) => adminApi.get(`/testimonials/${id}`),
  create: (data: any) => adminApi.post('/testimonials', data),
  update: (id: number, data: any) => adminApi.post(`/testimonials/${id}`, data),
  delete: (id: number) => adminApi.delete(`/testimonials/${id}`),
}

// Admin Leads API
export const adminLeadsAPI = {
  getAll: () => adminApi.get('/leads'),
  getById: (id: number) => adminApi.get(`/leads/${id}`),
  updateStatus: (id: number, status: string) =>
    adminApi.patch(`/leads/${id}`, { status }),
}

// Admin Queries API
export const adminQueriesAPI = {
  getAll: () => adminApi.get('/queries'),
  updateStatus: (id: number, status: string) => adminApi.put(`/queries/${id}/status`, { status }),
  delete: (id: number) => adminApi.delete(`/queries/${id}`),
}

// Admin Inquiry Form Settings API
export const adminInquiryFormSettingsAPI = {
  getAll: () => adminApi.get('/inquiry-form-settings'),
  getById: (id: number) => adminApi.get(`/inquiry-form-settings/${id}`),
  create: (data: { setting_key: string; label: string; options: string[]; is_active?: boolean; sort_order?: number }) =>
    adminApi.post('/inquiry-form-settings', data),
  update: (id: number, data: { label?: string; options?: string[]; is_active?: boolean; sort_order?: number }) =>
    adminApi.put(`/inquiry-form-settings/${id}`, data),
  delete: (id: number) => adminApi.delete(`/inquiry-form-settings/${id}`),
}
