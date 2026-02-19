
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminLeadsAPI } from '@/lib/admin-api'
import { getApiErrorMessage } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface Lead {
  id: number
  name: string
  last_name?: string
  email: string
  phone: string
  country?: string
  message: string
  status: 'new' | 'contacted' | 'converted' | 'closed'
  tour: { id: number; title: string } | null
  created_at: string
  feeling_description?: string
  selected_destination?: string
  travel_start_date?: string
  travel_end_date?: string
  dates_flexible?: boolean
  travel_party?: string
  adults_count?: number
  children_count?: number
  children_ages?: number[]
  budget_amount?: number
  budget_currency?: string
  travel_vibes?: string[]
  special_occasions?: string[]
  accommodation_type?: string
  private_tour_themes?: string[]
  experience_styles?: string[]
  concierge_interests?: string[]
  transfers_drivers?: string[]
  additional_notes?: string
  discovery_source?: string
}

export default function AdminLeadDetailPage() {
  const router = useRouter()
  const params = useParams()
  const leadId = parseInt(params.id as string)
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadLead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId])

  const loadLead = async () => {
    try {
      const response = await adminLeadsAPI.getById(leadId)
      setLead(response.data.data)
    } catch (error) {
      toast.error('Failed to load lead')
      router.push('/admin/leads')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!lead) return
    setUpdating(true)
    try {
      await adminLeadsAPI.updateStatus(lead.id, newStatus)
      setLead({ ...lead, status: newStatus as Lead['status'] })
      toast.success('Lead status updated successfully')
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to update lead status'))
    } finally {
      setUpdating(false)
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          <p className="mt-4 text-gray-600">Loading lead...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!lead) {
    return null
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link
            href="/admin/leads"
            className="text-gray-600 hover:text-gray-900 transition-colors inline-block mb-4"
          >
            ← Back to Leads
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold font-sans text-gray-900">Lead Details</h1>
            <span
              className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(lead.status)}`}
            >
              {lead.status}
            </span>
          </div>
          <p className="text-gray-600 mt-2">
            Received {new Date(lead.created_at).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-bold font-sans text-gray-900 mb-4 border-b pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                <p className="text-gray-900 font-semibold">{lead.name}</p>
              </div>
              {lead.last_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                  <p className="text-gray-900 font-semibold">{lead.last_name}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {lead.email}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                <a
                  href={`tel:${lead.phone}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {lead.phone}
                </a>
              </div>
              {lead.country && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                  <p className="text-gray-900">{lead.country}</p>
                </div>
              )}
              {lead.discovery_source && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">How They Found Us</label>
                  <p className="text-gray-900">{lead.discovery_source}</p>
                </div>
              )}
            </div>
          </div>

          {/* Travel Preferences */}
          {(lead.feeling_description || lead.selected_destination) && (
            <div>
              <h2 className="text-xl font-bold font-sans text-gray-900 mb-4 border-b pb-2">Travel Vision</h2>
              {lead.feeling_description && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">What Silk Road Feels Like</label>
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">
                    {lead.feeling_description}
                  </div>
                </div>
              )}
              {lead.selected_destination && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Selected Destination</label>
                  <p className="text-gray-900 font-semibold text-lg">{lead.selected_destination}</p>
                </div>
              )}
            </div>
          )}

          {/* Travel Details */}
          {(lead.travel_start_date || lead.travel_party || lead.adults_count) && (
            <div>
              <h2 className="text-xl font-bold font-sans text-gray-900 mb-4 border-b pb-2">Travel Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {lead.travel_start_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Travel Dates</label>
                    <p className="text-gray-900">
                      {new Date(lead.travel_start_date).toLocaleDateString()}
                      {lead.travel_end_date && ` - ${new Date(lead.travel_end_date).toLocaleDateString()}`}
                    </p>
                    {lead.dates_flexible && (
                      <span className="text-sm text-gray-600 italic">(Dates are flexible)</span>
                    )}
                  </div>
                )}
                {lead.travel_party && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Travel Party</label>
                    <p className="text-gray-900">{lead.travel_party}</p>
                  </div>
                )}
                {lead.adults_count && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Number of Travelers</label>
                    <p className="text-gray-900">
                      {lead.adults_count} Adult{lead.adults_count > 1 ? 's' : ''}
                      {lead.children_count && lead.children_count > 0 && (
                        <span>, {lead.children_count} Child{lead.children_count > 1 ? 'ren' : ''}</span>
                      )}
                    </p>
```
