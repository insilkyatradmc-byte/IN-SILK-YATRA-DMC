'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminReviewsAPI, adminToursAPI, adminDestinationsAPI } from '@/lib/admin-api'
import { getApiErrorMessage } from '@/lib/admin-utils'
import StarRating from '@/components/common/StarRating'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Plus,
  Filter,
  Search,
  Star,
  MessageSquare
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'

interface Review {
  id: number
  reviewer_name: string
  reviewer_email?: string
  profile_photo?: string
  message: string
  stars: number
  status: 'pending' | 'approved' | 'rejected'
  source: 'website' | 'admin'
  created_at: string
  reviewable_type: string
  reviewable_id: number
  reviewable?: {
    id: number
    title?: string
    name?: string
  }
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    type: '',
    search: ''
  })

  useEffect(() => {
    fetchReviews()
    fetchStatistics()
  }, [filters])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await adminReviewsAPI.getAll(filters)
      if (response.data.success) {
        setReviews(response.data.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await adminReviewsAPI.getStatistics()
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      const response = await adminReviewsAPI.approve(id)
      if (response.data.success) {
        toast.success('Review approved')
        fetchReviews()
        fetchStatistics()
        setSelectedReview(null)
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const handleReject = async (id: number) => {
    try {
      const response = await adminReviewsAPI.reject(id)
      if (response.data.success) {
        toast.success('Review rejected')
        fetchReviews()
        fetchStatistics()
        setSelectedReview(null)
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      const response = await adminReviewsAPI.delete(id)
      if (response.data.success) {
        toast.success('Review deleted')
        fetchReviews()
        fetchStatistics()
        setSelectedReview(null)
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Clock },
      approved: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
      rejected: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle }
    }
    
    const badge = badges[status as keyof typeof badges]
    if (!badge) return null
    
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
            <p className="text-gray-600 mt-1">Manage and moderate customer reviews</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#c9b896] text-white rounded-lg hover:bg-[#b8a886] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Review
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard icon={MessageSquare} label="Total Reviews" value={stats.total} color="blue" />
            <StatsCard icon={Clock} label="Pending" value={stats.pending} color="yellow" />
            <StatsCard icon={CheckCircle} label="Approved" value={stats.approved} color="green" />
            <StatsCard icon={Star} label="Website" value={stats.from_website} color="purple" />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search reviews..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9b896] focus:border-transparent outline-none"
            />
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9b896] focus:border-transparent outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9b896] focus:border-transparent outline-none"
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="admin">Admin</option>
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9b896] focus:border-transparent outline-none"
            >
              <option value="">All Types</option>
              <option value="tour">Tours</option>
              <option value="destination">Destinations</option>
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#c9b896] border-t-transparent"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Reviewer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      Entity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedReview(review)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {review.profile_photo ? (
                            <img
                              src={`${API_BASE}/${review.profile_photo}`}
                              alt={review.reviewer_name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                if (target.nextElementSibling) {
                                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div className={`w-10 h-10 rounded-full bg-[#c9b896] flex items-center justify-center text-white font-semibold ${review.profile_photo ? 'hidden' : ''}`}>
                            {review.reviewer_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{review.reviewer_name}</p>
                            {review.reviewer_email && (
                              <p className="text-sm text-gray-500 truncate">{review.reviewer_email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 break-words">
                            {review.reviewable?.title || review.reviewable?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {review.reviewable_type?.includes('Tour') ? 'Tour' : 'Destination'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StarRating rating={review.stars} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(review.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          review.source === 'website' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'bg-purple-50 text-purple-700'
                        }`}>
                          {review.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {review.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(review.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleReject(review.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No reviews found</p>
            </div>
          )}
        </div>

        {/* Review Details Modal */}
        {selectedReview && (
          <ReviewDetailsModal
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        )}

        {/* Create Review Modal */}
        {showCreateModal && (
          <CreateReviewModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              fetchReviews()
              fetchStatistics()
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color }: any) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  }

  return (
    <motion.div  
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${colors[color as keyof typeof colors]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

// Review Details Modal Component
function ReviewDetailsModal({ review, onClose, onApprove, onReject, onDelete }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
              <p className="text-gray-600 mt-1">
                {review.reviewable?.title || review.reviewable?.name}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Reviewer Info */}
          <div className="flex items-center gap-4">
            {review.profile_photo ? (
              <img
                src={`${API_BASE}/${review.profile_photo}`}
                alt={review.reviewer_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className={`w-16 h-16 rounded-full bg-[#c9b896] flex items-center justify-center text-white font-bold text-xl ${review.profile_photo ? 'hidden' : ''}`}>
              {review.reviewer_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-900">{review.reviewer_name}</p>
              {review.reviewer_email && (
                <p className="text-gray-600">{review.reviewer_email}</p>
              )}
              <StarRating rating={review.stars} size="md" showNumber />
            </div>
          </div>

          {/* Review Message */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Review</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
              {review.message}
            </p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">{review.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Source</p>
              <p className="font-medium">{review.source}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">
                {review.reviewable_type.includes('Tour') ? 'Tour' : 'Destination'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {review.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove(review.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>
                <button
                  onClick={() => onReject(review.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(review.id)}
              className="px-6 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Create Review Modal Component (simplified - full implementation would be similar to user ReviewForm)
function CreateReviewModal({ isOpen, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    type: 'tour',
    entityId: '',
    reviewer_name: '',
    reviewer_email: '',
    message: '',
    stars: 5,
    status: 'approved'
  })
  const [entities, setEntities] = useState<any[]>([])
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchEntities()
    }
  }, [isOpen, formData.type])

  const fetchEntities = async () => {
    try {
      if (formData.type === 'tour') {
        const response = await adminToursAPI.getAll()
        setEntities(response.data.data || [])
      } else {
        const response = await adminDestinationsAPI.getAll()
        setEntities(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching entities:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('type', formData.type)
      formDataToSend.append('id', formData.entityId)
      formDataToSend.append('reviewer_name', formData.reviewer_name)
      formDataToSend.append('reviewer_email', formData.reviewer_email)
      formDataToSend.append('message', formData.message)
      formDataToSend.append('stars', formData.stars.toString())
      formDataToSend.append('status', formData.status)
      
      if (profilePhoto) {
        formDataToSend.append('profile_photo', profilePhoto)
      }

      const response = await adminReviewsAPI.create(formDataToSend)

      if (response.data.success) {
        toast.success('Review created successfully')
        onSuccess()
        onClose()
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create New Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Review For</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, entityId: '' })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9b896] outline-none"
            >
              <option value="tour">Tour</option>
              <option value="destination">Destination</option>
            </select>
          </div>

          {/* Entity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select {formData.type === 'tour' ? 'Tour' : 'Destination'}
            </label>
            <select
              required
              value={formData.entityId}
              onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9b896] outline-none"
            >
              <option value="">Select...</option>
              {entities.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.title || entity.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Rating</label>
            <StarRating
              rating={formData.stars}
              size="lg"
              interactive
              onRatingChange={(stars) => setFormData({ ...formData, stars })}
            />
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Reviewer Name</label>
            <input
              type="text"
              required
              value={formData.reviewer_name}
              onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9b896] outline-none"
            />
          </div>

          {/* Reviewer Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Reviewer Email</label>
            <input
              type="email"
              value={formData.reviewer_email}
              onChange={(e) => setFormData({ ...formData, reviewer_email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9b896] outline-none"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#c9b896]/10 file:text-[#c9b896]"
            />
          </div>

          {/* Review Message */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Review Message</label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9b896] outline-none resize-none"
              minLength={10}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9b896] outline-none"
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#c9b896] text-white rounded-lg hover:bg-[#b8a886] disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Review'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
