'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsAppButton from '@/components/common/FloatingWhatsAppButton'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'min-h-screen'}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsAppButton />}
    </>
  )
}
