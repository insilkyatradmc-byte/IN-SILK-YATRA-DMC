'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminTestimonialsAPI, adminToursAPI } from '@/lib/admin-api'
import { getApiErrorMessage } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface Tour {
  id: number
  title: string
}

export default function EditTestimonialPage() {
  const router = useRouter()
  const params = useParams()
  const testimonialId = parseInt(params.id as string)
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    country: '',
    photo: null as File | null,
    is_active: true,
  })

  useEffect(() => {
    loadTours()
    loadTestimonial()
  }, [testimonialId])

  const loadTours = async () => {
    try {
      const response = await adminToursAPI.getAll()
      setTours(response.data.data)
    } catch (error) {
      toast.error('Failed to load tours')
    }
  }

  const loadTestimonial = async () => {
    try {
      const response = await adminTestimonialsAPI.getById(testimonialId)
      const testimonial = response.data.data
      setFormData({
        name: testimonial.name,
        content: testimonial.content,
        country: testimonial.country || '',
        photo: null,
        is_active: testimonial.is_active,
      })
      setExistingPhoto(testimonial.photo || null)
    } catch (error) {
      toast.error('Failed to load testimonial')
      router.push('/admin/testimonials')
    } finally {
      setInitialLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, photo: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
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
      submitData.append('content', formData.content.trim())
      submitData.append('country', formData.country.trim())
      
      if (formData.photo) {
        submitData.append('photo', formData.photo)
      }
      
      submitData.append('is_active', formData.is_active ? '1' : '0')

      await adminTestimonialsAPI.update(testimonialId, submitData)
      toast.success('Testimonial updated successfully!')
      router.push('/admin/testimonials')
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to update testimonial'))
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading testimonial...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/admin/testimonials" className="text-gray-600 hover:text-gray-900 transition-colors inline-block mb-4">
            ← Back to Testimonials
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold font-sans text-gray-900">Edit Testimonial</h1>
          <p className="text-gray-600 mt-2">Update testimonial details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
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
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., India, USA, UK"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo (Optional)
            </label>
            {existingPhoto && !photoPreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Current Photo:</p>
                <img
                  src={existingPhoto}
                  alt="Current testimonial"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {photoPreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">New Photo Preview:</p>
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimonial Content *
            </label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
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
              {loading ? 'Updating...' : 'Update Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
