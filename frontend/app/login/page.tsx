'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import toast from 'react-hot-toast'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await auth.login(formData.email, formData.password)
      if (result.success) {
        toast.success('Login successful!')
        const redirectTo = searchParams.get('redirect') || sessionStorage.getItem('redirect_after_login') || '/dashboard'
        sessionStorage.removeItem('redirect_after_login')
        router.push(redirectTo)
      } else {
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-24">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800/20 via-stone-950 to-stone-950 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link href="/">
            <img
              src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770101106/file_0000000073e87208b9708e744f83bf52_gx37wu.png"
              alt="IN-SILK YATRA"
              className="h-20 w-auto mx-auto"
            />
          </Link>
          <p className="mt-4 font-sans text-[10px] tracking-[0.3em] uppercase text-[#c9b896]">
            Welcome Back
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
              className="group relative w-full py-3.5 bg-[#c9b896] hover:bg-[#b8a685] text-stone-900 font-sans text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="font-sans text-xs text-white/40">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#c9b896] hover:text-white transition-colors duration-200">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <span className="font-sans text-xs tracking-widest uppercase text-white/40">Loading...</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

