'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminDestinationsAPI } from '@/lib/admin-api'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Destination {
  id: number
  name: string
  slug: string
  description: string
  country: string
  is_active: boolean
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDestinations()
  }, [])

  const loadDestinations = async () => {
    try {
      const response = await adminDestinationsAPI.getAll()
      setDestinations(response.data.data)
    } catch (error) {
      toast.error('Failed to load destinations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      await adminDestinationsAPI.delete(id)
      toast.success('Destination deleted successfully')
      loadDestinations()
    } catch (error) {
      toast.error('Failed to delete destination')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-900">Destinations Management</h1>
            <p className="text-gray-600 mt-2">Manage all travel destinations</p>
          </div>
          <Link
            href="/admin/destinations/new"
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            + Add New Destination
          </Link>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading destinations...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="bg-white border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold font-sans text-gray-900 mb-2">No destinations yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first destination.</p>
            <Link
              href="/admin/destinations/new"
              className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
            >
              Create First Destination
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Description
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
                  {destinations.map((dest) => (
                    <tr key={dest.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{dest.name}</td>
                      <td className="px-6 py-4 text-gray-700">{dest.country}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm truncate max-w-xs">{dest.description}</td>
                      <td className="px-6 py-4">
                        {dest.is_active ? (
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
                            href={`/admin/destinations/${dest.id}/edit`}
                            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-xs font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(dest.id, dest.name)}
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
