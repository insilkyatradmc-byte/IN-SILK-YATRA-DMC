'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminQueriesAPI } from '@/lib/admin-api'
import { getApiErrorMessage } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface Query {
  id: number
  full_name: string
  email: string
  phone: string
  country: string | null
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

type QueryStatusFilter = Query['status'] | 'all'

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<QueryStatusFilter>('all')

  useEffect(() => {
    loadQueries()
  }, [])

  const loadQueries = async () => {
    try {
      const response = await adminQueriesAPI.getAll()
      setQueries(response.data)
    } catch (error) {
      toast.error('Failed to load queries')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await adminQueriesAPI.updateStatus(id, newStatus)
      toast.success('Status updated successfully')
      loadQueries()
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to update status'))
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this query?')) return
    try {
      await adminQueriesAPI.delete(id)
      toast.success('Query deleted successfully')
      loadQueries()
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to delete query'))
    }
  }

  const filteredQueries =
    statusFilter === 'all'
      ? queries
      : queries.filter((q) => q.status === statusFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'read':
        return 'bg-yellow-100 text-yellow-800'
      case 'replied':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-900">Contact Queries</h1>
            <p className="text-gray-600 mt-2">Manage messages from the contact form</p>
          </div>
          <div className="flex gap-2">
            {(['all', 'new', 'read', 'replied'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 capitalize ${
                  statusFilter === status
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div className="bg-white border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-gray-600">No queries found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredQueries.map((query) => (
              <div key={query.id} className="bg-white shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium uppercase ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                    <h3 className="text-lg font-semibold font-sans text-gray-900">{query.subject}</h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(query.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">From</p>
                    <p className="text-gray-900">{query.full_name}</p>
                    <a href={`mailto:${query.email}`} className="text-primary-600 hover:underline">
                      {query.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Details</p>
                    <p className="text-gray-900">{query.phone}</p>
                    <p className="text-gray-600">{query.country}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{query.message}</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <select
                    value={query.status}
                    onChange={(e) => handleStatusUpdate(query.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none text-sm"
                  >
                    <option value="new">Mark as New</option>
                    <option value="read">Mark as Read</option>
                    <option value="replied">Mark as Replied</option>
                  </select>
                  
                  <button
                    onClick={() => handleDelete(query.id)}
                    className="px-4 py-2 text-black border border-black hover:bg-black hover:text-white text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                  
                  <a
                    href={`https://wa.me/${query.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${query.full_name}, Thank you for reaching out to In-Silk Yatra. Regarding: ${query.subject}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Reply via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
