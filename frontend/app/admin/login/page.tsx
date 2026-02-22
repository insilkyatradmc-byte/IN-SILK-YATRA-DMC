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
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-24">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800/20 via-stone-950 to-stone-950 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#c9b896]">
            Admin Portal
          </p>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl font-light text-white">
            Sign In
          </h1>
          <div className="mt-3 mx-auto w-8 h-[1px] bg-[#c9b896]/60" />
        </div>

        {/* Form Card */}
        <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block font-sans text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border border-white/20 text-white placeholder-white/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#c9b896] transition-colors duration-200"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-sans text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-transparent border border-white/20 text-white placeholder-white/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#c9b896] transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#c9b896] hover:bg-[#b8a685] text-stone-900 font-sans text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

