'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuth } from '@/lib/admin-auth'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Redirect if already logged in
    if (adminAuth.isAuthenticated()) {
      router.push('/admin/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await adminAuth.login(formData.email, formData.password)
      
      if (result.success) {
        toast.success('Login successful!')
        router.push('/admin/dashboard')
      } else {
        toast.error(result.error || 'Invalid credentials')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <img 
              src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770101106/file_0000000073e87208b9708e744f83bf52_gx37wu.png"
              alt="IN-SILK YATRA"
              className="h-12 w-auto mx-auto mb-4"
            />
            <p className="text-gray-500 text-sm">Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder="admin@insilkyatra.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Default: admin@insilkyatra.com / insilkyatradmc
            </p>
            <p className="text-xs text-gray-400">
              Change default password in production
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
