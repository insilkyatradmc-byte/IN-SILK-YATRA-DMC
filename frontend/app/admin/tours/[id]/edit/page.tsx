'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminToursAPI, adminDestinationsAPI } from '@/lib/admin-api'
import { getApiErrorMessage } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface Destination {
  id: number
  name: string
}

export default function EditTourPage() {
  const router = useRouter()
  const params = useParams()
  const tourId = parseInt(params.id as string)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImage, setExistingImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    destination_id: '',
    image: null as File | null,
    itinerary: '',
    inclusions: '',
    exclusions: '',
    featured: false,
    is_active: true,
  })

  useEffect(() => {
    loadDestinations()
    loadTour()
  }, [tourId])

  const loadDestinations = async () => {
    try {
      const response = await adminDestinationsAPI.getAll()
      setDestinations(response.data.data)
    } catch (error) {
      toast.error('Failed to load destinations')
    }
  }

  const loadTour = async () => {
    try {
      const response = await adminToursAPI.getById(tourId)
      const tour = response.data.data
      setFormData({
        title: tour.title,
        description: tour.description,
        price: tour.price.toString(),
        duration: tour.duration.toString(),
        destination_id: tour.destination_id.toString(),
        image: null,
        itinerary: tour.itinerary || '',
        inclusions: tour.inclusions || '',
        exclusions: tour.exclusions || '',
        featured: tour.featured,
        is_active: tour.is_active,
      })
      setExistingImage(tour.image || null)
    } catch (error) {
      toast.error('Failed to load tour')
      router.push('/admin/tours')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('title', formData.title.trim())
      submitData.append('description', formData.description.trim())
      submitData.append('price', formData.price)
      submitData.append('duration', formData.duration)
      submitData.append('destination_id', formData.destination_id)
      
      if (formData.image) {
        submitData.append('image', formData.image)
      }
      
      if (formData.itinerary.trim()) {
        submitData.append('itinerary', formData.itinerary.trim())
      }
      if (formData.inclusions.trim()) {
        submitData.append('inclusions', formData.inclusions.trim())
      }
      if (formData.exclusions.trim()) {
        submitData.append('exclusions', formData.exclusions.trim())
      }
      
      submitData.append('featured', formData.featured ? '1' : '0')
      submitData.append('is_active', formData.is_active ? '1' : '0')

      await adminToursAPI.update(tourId, submitData)
      toast.success('Tour updated successfully!')
      router.push('/admin/tours')
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to update tour'))
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading tour...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/admin/tours" className="text-gray-600 hover:text-gray-900 transition-colors inline-block mb-4">
            ← Back to Tours
          </Link>
          <h1 className="text-3xl font-bold font-sans text-gray-900">Edit Tour</h1>
          <p className="text-gray-600 mt-2">Update tour package details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Image
              </label>
              {existingImage && !imagePreview && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                  <img
                    src={existingImage}
                    alt="Current tour"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">New Image Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <select
                required
                value={formData.destination_id}
                onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select destination</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (days) *
              </label>
              <input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Itinerary
              </label>
              <textarea
                rows={4}
                value={formData.itinerary}
                onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inclusions
              </label>
              <textarea
                rows={3}
                value={formData.inclusions}
                onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exclusions
              </label>
              <textarea
                rows={3}
                value={formData.exclusions}
                onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Tour</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? 'Updating...' : 'Update Tour'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
