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
  const [existingGalleryPhotos, setExistingGalleryPhotos] = useState<string[]>([])
  const [newGalleryPhotos, setNewGalleryPhotos] = useState<{ file: File; preview: string }[]>([])
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
      const galleryPhotos = Array.isArray(testimonial.gallery_photos) ? testimonial.gallery_photos : []
      setExistingGalleryPhotos(galleryPhotos)
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

  const handleGalleryPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPhotos = files.map(file => {
      const preview = URL.createObjectURL(file)
      return { file, preview }
    })
    setNewGalleryPhotos([...newGalleryPhotos, ...newPhotos])
  }

  const removeExistingGalleryPhoto = (index: number) => {
    if (Array.isArray(existingGalleryPhotos)) {
      setExistingGalleryPhotos(existingGalleryPhotos.filter((_, i) => i !== index))
    }
  }

  const removeNewGalleryPhoto = (index: number) => {
    URL.revokeObjectURL(newGalleryPhotos[index].preview)
    setNewGalleryPhotos(newGalleryPhotos.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name.trim())
      submitData.append('content', formData.content.trim())
      
      // Only append country if it has a value
      const countryValue = formData.country.trim()
      if (countryValue) {
        submitData.append('country', countryValue)
      }
      
      if (formData.photo) {
        submitData.append('photo', formData.photo)
      }
      
      // Only send existing gallery photos if there are any
      const validExistingPhotos = Array.isArray(existingGalleryPhotos) 
        ? existingGalleryPhotos.filter(photo => photo && photo.trim()) 
        : []
      validExistingPhotos.forEach((photo) => {
        submitData.append('existing_gallery_photos[]', photo)
      })
      
      // Only send new gallery photos if there are any
      if (Array.isArray(newGalleryPhotos)) {
        newGalleryPhotos.forEach((photo) => {
          submitData.append('gallery_photos[]', photo.file)
        })
      }
      
      submitData.append('is_active', formData.is_active ? '1' : '0')

      // Debug log - show FormData contents
      console.log('FormData contents:')
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ':', pair[1])
      }
      
      console.log('Submitting testimonial update:', {
        name: formData.name,
        existingGalleryCount: Array.isArray(existingGalleryPhotos) ? existingGalleryPhotos.length : 0,
        newGalleryCount: Array.isArray(newGalleryPhotos) ? newGalleryPhotos.length : 0,
        testimonialId: testimonialId
      })

      const response = await adminTestimonialsAPI.update(testimonialId, submitData)
      console.log('Update Response:', response)
      toast.success('Testimonial updated successfully!')
      router.push('/admin/testimonials')
    } catch (error: any) {
      console.error('Update Error Full:', error)
      console.error('Update Error Response:', error.response)
      console.error('Update Error Data:', error.response?.data)
      const errorMsg = getApiErrorMessage(error, 'Failed to update testimonial')
      console.error('Error Message:', errorMsg)
      toast.error(errorMsg)
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Photos (Optional)
            </label>
            
            {Array.isArray(existingGalleryPhotos) && existingGalleryPhotos.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Current Gallery Photos:</p>
                <div className="grid grid-cols-3 gap-4">
                  {existingGalleryPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingGalleryPhoto(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryPhotosChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            {Array.isArray(newGalleryPhotos) && newGalleryPhotos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">New Gallery Photos:</p>
                <div className="grid grid-cols-3 gap-4">
                  {newGalleryPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewGalleryPhoto(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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
              {loading ? 'Updating...' : 'Update Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
