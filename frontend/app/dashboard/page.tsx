'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { auth, User } from '@/lib/auth'
import { wishlistAPI } from '@/lib/api'
import { getImageUrl } from '@/lib/images'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: number
  tour: {
    id: number
    title: string
    slug: string
    price: number
    duration: number
    image?: string
  }
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = auth.getUser()
      setUser(currentUser)
      try {
        const response = await wishlistAPI.getAll()
        setWishlist(response.data.data)
      } catch (error) {
        console.error('Error fetching wishlist:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleRemoveFromWishlist = async (tourId: number) => {
    try {
      await wishlistAPI.remove(tourId)
      setWishlist(wishlist.filter((item) => item.tour.id !== tourId))
      toast.success('Removed from wishlist')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist')
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <ProtectedRoute>
      {/* Dark luxury background */}
      <div className="min-h-screen bg-stone-950 text-white">
        {/* Top spacing for fixed navbar */}
        <div className="pt-32 md:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

          {/* Page heading */}
          <div className="mb-10 md:mb-14">
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-[#c9b896] mb-2">
              Account
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight">
              My Profile
            </h1>
            <div className="mt-4 w-12 h-[1px] bg-[#c9b896]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
            {/* ── Profile Card ── */}
            <div className="lg:col-span-1">
              <div className="border border-white/10 bg-white/5 p-6 md:p-8 rounded-sm">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#c9b896]/20 border border-[#c9b896]/40 flex items-center justify-center">
                    <span className="font-serif text-2xl md:text-3xl text-[#c9b896] font-light">
                      {initials}
                    </span>
                  </div>
                </div>

                {user ? (
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-4">
                      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">
                        Name
                      </p>
                      <p className="font-serif text-lg text-white font-light leading-snug">
                        {user.name}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">
                        Email
                      </p>
                      <p className="font-serif text-base text-white/80 font-light break-all leading-snug">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-full" />
                  </div>
                )}

                {/* Logout */}
                <button
                  onClick={async () => {
                    await auth.logout()
                    window.location.href = '/'
                  }}
                  className="mt-8 w-full border border-white/20 text-white/60 hover:border-[#c9b896] hover:text-[#c9b896] py-2.5 text-xs tracking-[0.2em] uppercase font-sans transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* ── Wishlist Card ── */}
            <div className="lg:col-span-2">
              <div className="border border-white/10 bg-white/5 p-6 md:p-8 rounded-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl md:text-2xl font-light text-white">
                    My Wishlist
                  </h2>
                  <span className="font-sans text-xs tracking-widest text-white/40 uppercase">
                    {wishlist.length} {wishlist.length === 1 ? 'Tour' : 'Tours'}
                  </span>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse flex gap-4 p-4 border border-white/10">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 flex-shrink-0 rounded-sm" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-white/10 rounded w-3/4" />
                          <div className="h-3 bg-white/10 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : wishlist.length > 0 ? (
                  <div className="space-y-3">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-white/10 hover:border-[#c9b896]/30 transition-colors duration-300 rounded-sm"
                      >
                        {/* Tour Image */}
                        <div className="w-full sm:w-24 h-36 sm:h-24 bg-stone-800 flex-shrink-0 rounded-sm overflow-hidden">
                          <img
                            src={getImageUrl(item.tour.image, item.tour.title)}
                            alt={item.tour.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Tour Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/tours/${item.tour.slug}`}
                            className="font-serif text-base md:text-lg font-light text-white hover:text-[#c9b896] transition-colors duration-200 leading-snug block"
                          >
                            {item.tour.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="font-sans text-xs tracking-widest text-[#c9b896]">
                              ${item.tour.price}
                            </span>
                            <span className="text-white/20">·</span>
                            <span className="font-sans text-xs text-white/50 tracking-wider">
                              {item.tour.duration} days
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromWishlist(item.tour.id)}
                          className="self-start sm:self-center flex-shrink-0 border border-white/20 hover:border-red-500/60 text-white/40 hover:text-red-400 px-4 py-2 text-xs tracking-[0.15em] uppercase font-sans transition-all duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-14 text-center">
                    <p className="font-serif text-lg font-light text-white/40 mb-4">
                      Your wishlist is empty.
                    </p>
                    <Link
                      href="/tours"
                      className="inline-block border border-[#c9b896]/40 hover:border-[#c9b896] text-[#c9b896] px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#c9b896]/10"
                    >
                      Browse Tours
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
