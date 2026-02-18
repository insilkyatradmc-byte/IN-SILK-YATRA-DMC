import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, Dancing_Script } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import { Toaster } from 'react-hot-toast'

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
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
