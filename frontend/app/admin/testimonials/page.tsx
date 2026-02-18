'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminTestimonialsAPI } from '@/lib/admin-api'
import { getOptimizedImageUrl } from '@/lib/admin-performance'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Testimonial {
  id: number
  name: string
  content: string
  photo: string | null
  country: string | null
  is_active: boolean
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const response = await adminTestimonialsAPI.getAll()
      setTestimonials(response.data.data || [])
    } catch (error) {
      console.error('Failed to load testimonials:', error)
      toast.error('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial from "${name}"?`)) return

    // Optimistic UI update
    const originalTestimonials = [...testimonials]
    setTestimonials(testimonials.filter(t => t.id !== id))

    try {
      await adminTestimonialsAPI.delete(id)
      toast.success('Testimonial deleted successfully')
    } catch (error) {
      // Rollback on error
      setTestimonials(originalTestimonials)
      toast.error('Failed to delete testimonial')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-900">Testimonials Management</h1>
            <p className="text-gray-500 mt-1">Manage customer testimonials</p>
          </div>
          <Link
            href="/admin/testimonials/new"
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
          >
            + Add New Testimonial
          </Link>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            <h3 className="text-xl font-semibold font-sans text-gray-900 mb-2">No testimonials yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first testimonial.</p>
            <Link
              href="/admin/testimonials/new"
              className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
            >
              Add First Testimonial
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {testimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {testimonial.photo ? (
                            <img
                              src={getOptimizedImageUrl(testimonial.photo, 80, 80, 75)}
                              alt={testimonial.name}
                              className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 ${testimonial.photo ? 'hidden' : ''}`}>
                            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <span className="font-semibold text-gray-900">{testimonial.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {testimonial.country || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm truncate max-w-xs">
                        {testimonial.content}
                      </td>
                      <td className="px-6 py-4">
                        {testimonial.is_active ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/testimonials/${testimonial.id}/edit`}
                            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(testimonial.id, testimonial.name)}
                            className="px-4 py-2 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
