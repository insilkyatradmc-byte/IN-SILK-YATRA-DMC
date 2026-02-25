'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminJourneyPhotosAPI } from '@/lib/admin-api'
import { getOptimizedImageUrl } from '@/lib/admin-performance'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '@/lib/admin-utils'

interface JourneyPhoto {
  id: number
  photo_url: string
  carousel_number: number
  display_order: number
  is_active: boolean
  created_at: string
}

export default function AdminJourneyPhotosPage() {
  const [photos, setPhotos] = useState<JourneyPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<JourneyPhoto | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    photo: null as File | null,
    carousel_number: 1,
    is_active: true,
  })

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      const response = await adminJourneyPhotosAPI.getAll()
      setPhotos(response.data.data || [])
    } catch (error) {
      console.error('Failed to load journey photos:', error)
      toast.error('Failed to load photos')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (editingPhoto) {
      // Single file for edit mode
      const file = files[0]
      if (file) {
        setFormData({ ...formData, photo: file })
        const reader = new FileReader()
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    } else {
      // Multiple files for add mode
      if (files.length > 0) {
        setSelectedFiles(files)
        
        // Generate previews for all files
        const previews: string[] = []
        let loadedCount = 0
        
        files.forEach((file) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            previews.push(reader.result as string)
            loadedCount++
            
            if (loadedCount === files.length) {
              setFilePreviews(previews)
            }
          }
          reader.readAsDataURL(file)
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPhoto) {
      // Single photo update
      if (!formData.photo && !editingPhoto) {
        toast.error('Please select a photo')
        return
      }

      const submitData = new FormData()
      if (formData.photo) {
        submitData.append('photo', formData.photo)
      }
      submitData.append('carousel_number', formData.carousel_number.toString())
      submitData.append('is_active', formData.is_active ? '1' : '0')

      try {
        await adminJourneyPhotosAPI.update(editingPhoto.id, submitData)
        toast.success('Photo updated successfully')
        setShowModal(false)
        resetForm()
        loadPhotos()
      } catch (error: any) {
        toast.error(getApiErrorMessage(error, 'Failed to save photo'))
      }
    } else {
      // Multiple photos upload
      if (selectedFiles.length === 0) {
        toast.error('Please select at least one photo')
        return
      }

      setUploading(true)
      let successCount = 0
      let failCount = 0

      try {
        // Upload photos one by one
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i]
          const submitData = new FormData()
          submitData.append('photo', file)
          submitData.append('carousel_number', formData.carousel_number.toString())
          submitData.append('is_active', formData.is_active ? '1' : '0')

          try {
            await adminJourneyPhotosAPI.create(submitData)
            successCount++
            toast.success(`Uploaded ${successCount}/${selectedFiles.length}`)
          } catch (error) {
            failCount++
            console.error(`Failed to upload ${file.name}:`, error)
          }
        }

        if (successCount > 0) {
          toast.success(`Successfully uploaded ${successCount} photo(s)`)
        }
        if (failCount > 0) {
          toast.error(`Failed to upload ${failCount} photo(s)`)
        }

        setShowModal(false)
        resetForm()
        loadPhotos()
      } catch (error: any) {
        toast.error('Failed to upload photos')
      } finally {
        setUploading(false)
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    const originalPhotos = [...photos]
    setPhotos(photos.filter(p => p.id !== id))

    try {
      await adminJourneyPhotosAPI.delete(id)
      toast.success('Photo deleted successfully')
    } catch (error) {
      setPhotos(originalPhotos)
      toast.error('Failed to delete photo')
    }
  }

  const handleEdit = (photo: JourneyPhoto) => {
    setEditingPhoto(photo)
    setPhotoPreview(photo.photo_url)
    setFormData({
      photo: null,
      carousel_number: photo.carousel_number,
      is_active: photo.is_active,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingPhoto(null)
    setPhotoPreview(null)
    setSelectedFiles([])
    setFilePreviews([])
    setFormData({
      photo: null,
      carousel_number: 1,
      is_active: true,
    })
  }

  const carousel1Photos = photos.filter(p => p.carousel_number === 1).sort((a, b) => a.display_order - b.display_order)
  const carousel2Photos = photos.filter(p => p.carousel_number === 2).sort((a, b) => a.display_order - b.display_order)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-900">Journey Photos Management</h1>
            <p className="text-gray-500 mt-1">Manage photos for &quot;Our Journey Together&quot; carousels</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
          >
            + Add Photo
          </button>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading photos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carousel 1 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Carousel 1</h2>
                <p className="text-blue-100 text-sm mt-1">{carousel1Photos.length} photos</p>
              </div>
              <div className="p-6 space-y-4">
                {carousel1Photos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No photos in Carousel 1</p>
                ) : (
                  carousel1Photos.map((photo) => (
                    <div key={photo.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <img
                        src={getOptimizedImageUrl(photo.photo_url, 100, 100)}
                        alt="Journey photo"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Order: {photo.display_order}</p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${
                          photo.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {photo.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(photo)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Carousel 2 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Carousel 2</h2>
                <p className="text-purple-100 text-sm mt-1">{carousel2Photos.length} photos</p>
              </div>
              <div className="p-6 space-y-4">
                {carousel2Photos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No photos in Carousel 2</p>
                ) : (
                  carousel2Photos.map((photo) => (
                    <div key={photo.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <img
                        src={getOptimizedImageUrl(photo.photo_url, 100, 100)}
                        alt="Journey photo"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Order: {photo.display_order}</p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${
                          photo.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {photo.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(photo)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingPhoto ? 'Edit Photo' : 'Add Photos (Multiple)'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingPhoto ? 'Photo' : 'Select Photos (Multiple)'} {!editingPhoto && '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple={!editingPhoto}
                  onChange={handlePhotoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required={!editingPhoto}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingPhoto ? 'Upload a new photo to replace the current one' : 'You can select multiple photos at once'}
                </p>
                
                {/* Single photo preview (Edit mode) */}
                {editingPhoto && photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded"
                  />
                )}
                
                {/* Multiple photos preview (Add mode) */}
                {!editingPhoto && filePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Selected: {filePreviews.length} photo(s)
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {filePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = [...selectedFiles]
                              const newPreviews = [...filePreviews]
                              newFiles.splice(index, 1)
                              newPreviews.splice(index, 1)
                              setSelectedFiles(newFiles)
                              setFilePreviews(newPreviews)
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xs"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                            {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carousel *
                </label>
                <select
                  value={formData.carousel_number}
                  onChange={(e) => setFormData({ ...formData, carousel_number: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value={1}>Carousel 1</option>
                  <option value={2}>Carousel 2</option>
                </select>
                {!editingPhoto && filePreviews.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    All {filePreviews.length} photo(s) will be added to this carousel
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : editingPhoto ? 'Update' : `Add ${selectedFiles.length || ''} Photo(s)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
