'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminLeadsAPI } from '@/lib/admin-api'
import { getApiErrorMessage } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  message: string
  status: 'new' | 'contacted' | 'converted' | 'closed'
  tour: {
    id: number
    title: string
  } | null
  created_at: string
}

type LeadStatusFilter = Lead['status'] | 'all'

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [statusFilter, setStatusFilter] = useState<LeadStatusFilter>('all')

  useEffect(() => {
    loadLeads()
  }, [])

  const filteredLeads =
    statusFilter === 'all'
      ? leads
      : leads.filter((l) => l.status === statusFilter)

  const loadLeads = async () => {
    try {
      const response = await adminLeadsAPI.getAll()
      setLeads(response.data.data)
    } catch (error) {
      toast.error('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (leadId: number, newStatus: string) => {
    try {
      await adminLeadsAPI.updateStatus(leadId, newStatus)
      toast.success('Lead status updated successfully')
      loadLeads()
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus as Lead['status'] })
      }
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to update lead status'))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'converted':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-sans text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">View and manage customer inquiries</p>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <h3 className="text-xl font-semibold font-sans text-gray-900 mb-2">No leads yet</h3>
            <p className="text-gray-500">Customer inquiries will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads List */}
            <div className="lg:col-span-2 bg-white border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-lg font-semibold font-sans text-gray-900">All Leads</h2>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as LeadStatusFilter)}
                  className="px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedLead?.id === lead.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium ${getStatusColor(lead.status)}`}
                        >
                          {lead.status}
                        </span>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-all text-xs font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{lead.message}</p>
                    {lead.tour && (
                      <p className="text-xs text-gray-500 mt-1">Tour: {lead.tour.title}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {filteredLeads.length === 0 && (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No leads match the selected filter.
                  </div>
                )}
              </div>
            </div>

            {/* Lead Details */}
            <div className="bg-white border border-gray-200 p-6">
              {selectedLead ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-sans text-gray-900 mb-4">Lead Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-gray-900 font-semibold">{selectedLead.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedLead.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedLead.phone}</p>
                      </div>
                      {selectedLead.tour && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Interested Tour</label>
                          <p className="text-gray-900">{selectedLead.tour.title}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Message</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedLead.message}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date</label>
                        <p className="text-gray-900">
                          {new Date(selectedLead.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => handleStatusUpdate(selectedLead.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Quick Contact</label>
                    <div className="space-y-2">
                      <a
                        href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedLead.name}, This is In-Silk Yatra team. How can we assist you with your travel plans?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors w-full justify-center"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span className="text-sm font-medium">Contact via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                  <p>Select a lead to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
