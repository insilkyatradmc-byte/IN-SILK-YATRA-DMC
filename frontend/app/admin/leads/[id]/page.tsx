
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminLeadsAPI } from '@/lib/admin-api'
import { getApiErrorMessage } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

export default function AdminLeadDetailPage() {
  const router = useRouter()
  const params = useParams()
  const leadId = parseInt(params.id as string)
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadLead()
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
        {/* Additional code continues... */}
      </div>
    </AdminLayout>
  )
}

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
  
  // Detailed inquiry fields
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
                    {lead.children_ages && lead.children_ages.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Children ages: {lead.children_ages.join(', ')}
                      </p>
                    )}
                  </div>
                )}
                {lead.budget_amount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Budget</label>
                    <p className="text-gray-900 font-semibold text-lg">
                      {lead.budget_amount.toLocaleString()} {lead.budget_currency || 'EUR'}
                    </p>
                    <p className="text-sm text-gray-600">(excluding flights)</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Travel Style */}
          {(lead.travel_vibes?.length || lead.special_occasions?.length || lead.accommodation_type) && (
            <div>
              <h2 className="text-xl font-bold font-sans text-gray-900 mb-4 border-b pb-2">Travel Style & Preferences</h2>
              <div className="space-y-4">
                {lead.travel_vibes && lead.travel_vibes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Travel Vibes</label>
                    <div className="flex flex-wrap gap-2">
                      {lead.travel_vibes.map((vibe, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {vibe}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {lead.special_occasions && lead.special_occasions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Special Occasions</label>
                    <div className="flex flex-wrap gap-2">
                      {lead.special_occasions.map((occasion, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {occasion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {lead.accommodation_type && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Accommodation Preference</label>
                    <p className="text-gray-900">{lead.accommodation_type}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trip Enhancements */}
          {(lead.private_tour_themes?.length || lead.experience_styles?.length || lead.concierge_interests?.length || lead.transfers_drivers?.length) && (
            <div>
              <h2 className="text-xl font-bold font-sans text-gray-900 mb-4 border-b pb-2">Trip Enhancements</h2>
              <div className="space-y-4">
                {lead.private_tour_themes && lead.private_tour_themes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Private Tour Themes</label>
                    <div className="flex flex-wrap gap-2">
                      {lead.private_tour_themes.map((theme, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {lead.experience_styles && lead.experience_styles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Experience Styles</label>
                    <div className="flex flex-wrap gap-2">
                      {lead.experience_styles.map((style, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {lead.concierge_interests && lead.concierge_interests.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Concierge Services</label>
                    <div className="flex flex-wrap gap-2">
                      {lead.concierge_interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {lead.transfers_drivers && lead.transfers_drivers.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Transfers & Drivers</label>
                    <div className="flex flex-wrap gap-2">
                      {lead.transfers_drivers.map((transfer, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                          {transfer}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(lead.message || lead.additional_notes || lead.tour) && (
            <div>
              <h2 className="text-xl font-bold font-sans text-gray-900 mb-4 border-b pb-2">Additional Information</h2>
              {lead.tour && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Interested Tour</label>
                  <p className="text-gray-900 font-medium">{lead.tour.title}</p>
                </div>
              )}
              {lead.message && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">
                    {lead.message}
                  </div>
                </div>
              )}
              {lead.additional_notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Additional Notes</label>
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">
                    {lead.additional_notes}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
            <select
              value={lead.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={updating}
              className="w-full sm:w-auto min-w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Quick Contact Actions */}
          <div className="pt-6 border-t mt-6">
            <h3 className="text-lg font-bold font-sans text-gray-900 mb-4">Quick Contact</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.name}, This is In-Silk Yatra team reaching out regarding your travel inquiry. How can we assist you?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="font-medium">WhatsApp {lead.name}</span>
              </a>
              
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium">Call {lead.name}</span>
              </a>
              
              <a
                href={`mailto:${lead.email}?subject=Regarding Your Travel Inquiry&body=Dear ${lead.name},%0D%0A%0D%0AThank you for your interest in our travel services.%0D%0A%0D%0ABest regards,%0D%0AIn-Silk Yatra Team`}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Email {lead.name}</span>
              </a>
            </div>
            
            {/* Contact Information Display */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 text-gray-900 font-medium">{lead.phone}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900 font-medium">{lead.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
