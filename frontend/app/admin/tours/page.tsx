'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminToursAPI } from '@/lib/admin-api'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Tour {
  id: number
  title: string
  slug: string
  description: string
  price: number
  duration: number
  featured: boolean
  is_active: boolean
  destination: {
    id: number
    name: string
  }
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTours()
  }, [])

  const loadTours = async () => {
    try {
      const response = await adminToursAPI.getAll()
      setTours(response.data.data)
    } catch (error) {
      toast.error('Failed to load tours')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await adminToursAPI.delete(id)
      toast.success('Tour deleted successfully')
      loadTours()
    } catch (error) {
      toast.error('Failed to delete tour')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-900">Tours Management</h1>
            <p className="text-gray-600 mt-2">Manage all tour packages</p>
          </div>
          <Link
            href="/admin/tours/new"
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            + Add New Tour
          </Link>
        </div>

        {/* Tours Table */}
        {loading ? (
          <div className="bg-white border border-gray-200 shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tours...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="bg-white border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold font-sans text-gray-900 mb-2">No tours yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first tour package.</p>
            <Link
              href="/admin/tours/new"
              className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
            >
              Create First Tour
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tour
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Duration
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
                  {tours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{tour.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{tour.description}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{tour.destination?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">${tour.price}</td>
                      <td className="px-6 py-4 text-gray-700">{tour.duration} days</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {tour.featured && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                          {tour.is_active ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/tours/${tour.id}/edit`}
                            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-xs font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(tour.id, tour.title)}
                            className="px-4 py-2 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors text-xs font-medium"
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
