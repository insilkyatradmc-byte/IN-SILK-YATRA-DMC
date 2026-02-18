import axios from 'axios'
import Cookies from 'js-cookie'
import { apiCache } from './cache'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Request queue to prevent duplicate simultaneous requests
const pendingRequests = new Map<string, Promise<any>>()

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 second timeout
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      Cookies.remove('auth_token')
      Cookies.remove('user')
      if (typeof window !== 'undefined') {
        // Notify UI (Navbar etc.) to update immediately
        window.dispatchEvent(new Event('auth_changed'))
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Helper function to prevent duplicate requests
async function deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!
  }

  const promise = requestFn().finally(() => {
    pendingRequests.delete(key)
  })

  pendingRequests.set(key, promise)
  return promise
}

export default api

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// Tours API with caching
export const toursAPI = {
  getAll: async (params?: { destination_id?: number; featured?: boolean }) => {
    const cacheKey = `tours_${JSON.stringify(params || {})}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      return { data: cached }
    }
    
    return deduplicateRequest(cacheKey, async () => {
      const response = await api.get('/tours', { params })
      apiCache.set(cacheKey, response.data, 5 * 60 * 1000) // 5 minutes
      return response
    })
  },
  getById: async (id: number) => {
    const cacheKey = `tour_${id}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      return { data: cached }
    }
    
    return deduplicateRequest(cacheKey, async () => {
      const response = await api.get(`/tours/${id}`)
      apiCache.set(cacheKey, response.data, 10 * 60 * 1000) // 10 minutes
      return response
    })
  },
}

// Destinations API with caching
export const destinationsAPI = {
  getAll: async () => {
    const cacheKey = 'destinations_all'
    const cached = apiCache.get(cacheKey)
    if (cached) {
      return { data: cached }
    }
    
    return deduplicateRequest(cacheKey, async () => {
      const response = await api.get('/destinations')
      apiCache.set(cacheKey, response.data, 10 * 60 * 1000) // 10 minutes
      return response
    })
  },
  getById: async (id: number) => {
    const cacheKey = `destination_${id}`
    const cached = apiCache.get(cacheKey)
    if (cached) {
      return { data: cached }
    }
    
    return deduplicateRequest(cacheKey, async () => {
      const response = await api.get(`/destinations/${id}`)
      apiCache.set(cacheKey, response.data, 10 * 60 * 1000) // 10 minutes
      return response
    })
  },
}

// Wishlist API
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (tourId: number) => api.post('/wishlist', { tour_id: tourId }),
  remove: (tourId: number) => api.delete(`/wishlist/${tourId}`),
}

// Testimonials API with caching
export const testimonialsAPI = {
  getAll: async () => {
    const cacheKey = 'testimonials_all'
    const cached = apiCache.get(cacheKey)
    if (cached) {
      return { data: cached }
    }
    
    return deduplicateRequest(cacheKey, async () => {
      const response = await api.get('/testimonials')
      apiCache.set(cacheKey, response.data, 15 * 60 * 1000) // 15 minutes
      return response
    })
  },
}

// Contact/Leads API
export const leadsAPI = {
  create: (data: { name: string; email: string; phone: string; tour_id?: number; message: string }) =>
    api.post('/leads', data),
}

// Contact Queries API
export const contactAPI = {
  create: (data: any) => api.post('/contact', data),
  getAll: () => api.get('/admin/queries'),
  updateStatus: (id: number, status: string) => api.put(`/admin/queries/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/admin/queries/${id}`),
}

// Inquiry Form Settings API (Public)
export const inquiryFormSettingsAPI = {
  getAll: () => api.get('/inquiry-form-settings'),
}
