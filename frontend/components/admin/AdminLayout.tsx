'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { adminAuth, Admin } from '@/lib/admin-auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const syncAdmin = () => setAdmin(adminAuth.getAdmin())
    syncAdmin()

    window.addEventListener('admin_auth_changed', syncAdmin)
    return () => window.removeEventListener('admin_auth_changed', syncAdmin)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    
    if (!adminAuth.isAuthenticated()) {
      router.push('/admin/login')
    }
  }, [mounted, router])

  const handleLogout = async () => {
    await adminAuth.logout()
    router.push('/admin/login')
  }

  if (!mounted || !adminAuth.isAuthenticated()) {
    return null
  }

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/tours', label: 'Tours' },
    { href: '/admin/destinations', label: 'Destinations' },
    { href: '/admin/testimonials', label: 'Testimonials' },
    { href: '/admin/reviews', label: 'Reviews' },
    { href: '/admin/journey-photos', label: 'Journey Photos' },
    { href: '/admin/leads', label: 'Leads' },
    { href: '/admin/queries', label: 'Contact Queries' },
    { href: '/admin/inquiry-settings', label: 'Inquiry Form Settings' },
    { href: '/', label: 'Home' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col min-h-full">
          <div className="p-6 border-b border-gray-100">
            <Link href="/admin/dashboard" className="block">
              <img 
                src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770101106/file_0000000073e87208b9708e744f83bf52_gx37wu.png"
                alt="IN-SILK YATRA"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen p-4 sm:p-6 lg:p-10 pt-16 lg:pt-6">{children}</main>
      </div>
    </div>
  )
}
