'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminDestinationsAPI } from '@/lib/admin-api'
import { getApiErrorMessage } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

export default function EditDestinationPage() {
  const router = useRouter()
  const params = useParams()
  const destinationId = parseInt(params.id as string)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImage, setExistingImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: 'Kazakhstan',
    image: null as File | null,
    is_active: true,
  })

  useEffect(() => {
    loadDestination()
  }, [destinationId])

  const loadDestination = async () => {
    try {
      const response = await adminDestinationsAPI.getById(destinationId)
      const dest = response.data.data
      setFormData({
        name: dest.name,
        description: dest.description,
        country: dest.country,
        image: null,
        is_active: dest.is_active,
      })
      setExistingImage(dest.image || null)
    } catch (error) {
      toast.error('Failed to load destination')
      router.push('/admin/destinations')
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
      submitData.append('name', formData.name.trim())
      submitData.append('description', formData.description.trim())
      submitData.append('country', formData.country)
      
      if (formData.image) {
        submitData.append('image', formData.image)
      }
      
      submitData.append('is_active', formData.is_active ? '1' : '0')

      await adminDestinationsAPI.update(destinationId, submitData)
      toast.success('Destination updated successfully!')
      router.push('/admin/destinations')
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to update destination'))
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading destination...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/admin/destinations" className="text-gray-600 hover:text-gray-900 transition-colors inline-block mb-4">
            ← Back to Destinations
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold font-sans text-gray-900">Edit Destination</h1>
          <p className="text-gray-600 mt-2">Update destination details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Azerbaijan">Azerbaijan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Image
            </label>
            {existingImage && !imagePreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                <img
                  src={existingImage}
                  alt="Current destination"
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
              {loading ? 'Updating...' : 'Update Destination'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
