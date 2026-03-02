import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, Dancing_Script } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import { Toaster } from 'react-hot-toast'
import { SpeedInsights } from '@vercel/speed-insights/next'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cormorant',
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
  fallback: ['cursive', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'IN-SILK YATRA DMC - Luxury Travel in Kazakhstan, Kyrgyzstan & Azerbaijan',
  description: 'Premium Destination Management Company offering luxury tours and travel experiences in Kazakhstan, Kyrgyzstan, and Azerbaijan.',
  keywords: 'travel, Kazakhstan, Kyrgyzstan, Azerbaijan, luxury tours, DMC',
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'IN-SILK YATRA DMC',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'} />
      </head>
      <body className={`${cormorant.variable} ${inter.variable} ${dancingScript.variable} font-sans antialiased`} suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster 
          position="top-center"
          gutter={12}
          containerStyle={{
            top: 80,
          }}
          containerClassName="toast-container"
          toastOptions={{
            duration: 4000,
            className: 'font-light tracking-wide',
            style: {
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              color: '#f9fafb',
              padding: '16px 24px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              fontFamily: 'var(--font-inter)',
              fontSize: '15px',
              fontWeight: '300',
              letterSpacing: '0.01em',
              maxWidth: '420px',
              minHeight: '56px',
            },
            success: {
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#d1fae5',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#d1fae5',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fee2e2',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fee2e2',
              },
            },
            loading: {
              style: {
                background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#dbeafe',
              },
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#dbeafe',
              },
            },
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  )
}
