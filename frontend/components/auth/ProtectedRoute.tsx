'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [router])

  useEffect(() => {
    if (!mounted) return

    if (!auth.isAuthenticated()) {
      // Store current path for redirect after login
      sessionStorage.setItem('redirect_after_login', window.location.pathname)
      router.push('/login')
    }
  }, [mounted, router])

  // Avoid hydration mismatch: server and first client render return the same output.
  if (!mounted) return null

  if (!auth.isAuthenticated()) {
    return null
  }

  return <>{children}</>
}
