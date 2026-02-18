'use client'

import { useEffect, useState, memo } from 'react'
import Link from 'next/link'
import { toursAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface Tour {
  id: number
  title: string
  slug: string
  description: string
  price: number
  duration: number
  image?: string
  featured: boolean
}

const FeaturedTours = memo(function FeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await toursAPI.getAll({ featured: true })
        setTours(response.data.data.slice(0, 3)) // Show only 3 featured tours
      } catch (error) {
        console.error('Error fetching tours:', error)
        toast.error('Failed to load featured tours')
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Tours</h2>
          <div className="text-center">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Tours</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.length > 0 ? (
            tours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {tour.image ? (
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-primary-600 font-bold">${tour.price}</span>
                    <span className="text-gray-500">{tour.duration} days</span>
                  </div>
                  <Link
                    href={`/tours/${tour.slug}`}
                    prefetch={true}
                    className="block w-full bg-primary-600 text-white text-center py-2 rounded hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              No featured tours available at the moment.
            </div>
          )}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/tours"
            prefetch={true}
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            View All Tours
          </Link>
        </div>
      </div>
    </section>
  )
})

export default FeaturedTours
