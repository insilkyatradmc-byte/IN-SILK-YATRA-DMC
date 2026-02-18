'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { auth, User } from '@/lib/auth'
import { wishlistAPI, toursAPI } from '@/lib/api'
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                {user && (
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Name:</span> {user.name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Wishlist Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>

                {loading ? (
                  <div className="text-center py-8">Loading wishlist...</div>
                ) : wishlist.length > 0 ? (
                  <div className="space-y-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.tour.image ? (
                            <img
                              src={item.tour.image}
                              alt={item.tour.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/tours/${item.tour.slug}`}
                            className="text-lg font-semibold text-primary-600 hover:text-primary-700"
                          >
                            {item.tour.title}
                          </Link>
                          <div className="flex items-center gap-4 mt-2 text-gray-600">
                            <span>${item.tour.price}</span>
                            <span>•</span>
                            <span>{item.tour.duration} days</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.tour.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Your wishlist is empty.</p>
                    <Link href="/tours" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
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
