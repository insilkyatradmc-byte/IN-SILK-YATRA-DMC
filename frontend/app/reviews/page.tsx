'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReviewCard from '@/components/common/ReviewCard'
import ReviewForm from '@/components/common/ReviewForm'
import StarRating from '@/components/common/StarRating'
import { reviewsAPI, toursAPI, destinationsAPI } from '@/lib/api'
import { MessageSquare, Star, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Review {
  id: number
  reviewer_name: string
  reviewer_email?: string
  profile_photo?: string
  message: string
  stars: number
  created_at: string
  status: string
  reviewable_type: string
  reviewable_id: number
}

interface EntityOption {
  id: number
  name: string
  type: 'tour' | 'destination'
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [entities, setEntities] = useState<EntityOption[]>([])
  const [selectedEntity, setSelectedEntity] = useState<EntityOption | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'tour' | 'destination'>('all')

  useEffect(() => {
    fetchReviews()
    fetchEntities()
  }, [filterType])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const params: any = { per_page: 20 }
      if (filterType !== 'all') {
        params.type = filterType
      }
      
      const response = await reviewsAPI.getAll(params)
      if (response.data.success) {
        setReviews(response.data.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const fetchEntities = async () => {
    try {
      const [toursRes, destinationsRes] = await Promise.all([
        toursAPI.getAll(),
        destinationsAPI.getAll()
      ])

      const tourOptions: EntityOption[] = (toursRes.data.data || []).map((tour: any) => ({
        id: tour.id,
        name: tour.title,
        type: 'tour' as const
      }))

      const destOptions: EntityOption[] = (destinationsRes.data.data || []).map((dest: any) => ({
        id: dest.id,
        name: dest.name,
        type: 'destination' as const
      }))

      setEntities([...tourOptions, ...destOptions])
    } catch (error) {
      console.error('Error fetching entities:', error)
    }
  }

  const handleWriteReview = () => {
    if (!selectedEntity) {
      toast.error('Please select a tour or destination to review')
      return
    }
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8e6e1] to-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#c9b896] rounded-full mb-6">
            <Star className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4">
            Customer Reviews
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Read what travelers are saying about their experiences with IN-SILK YATRA DMC
          </p>
        </motion.div>

        {/* Write Review Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#c9b896]/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-[#c9b896]" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Share Your Experience
                </h2>
                <p className="text-gray-600">
                  Select a tour or destination and write a review
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <select
                value={selectedEntity?.id || ''}
                onChange={(e) => {
                  const entity = entities.find(ent => ent.id === parseInt(e.target.value))
                  setSelectedEntity(entity || null)
                }}
                className="w-full sm:w-64 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9b896] focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Tour/Destination</option>
                <optgroup label="Tours">
                  {entities.filter(e => e.type === 'tour').map(entity => (
                    <option key={`tour-${entity.id}`} value={entity.id}>
                      {entity.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Destinations">
                  {entities.filter(e => e.type === 'destination').map(entity => (
                    <option key={`dest-${entity.id}`} value={entity.id}>
                      {entity.name}
                    </option>
                  ))}
                </optgroup>
              </select>

              <button
                onClick={handleWriteReview}
                className="w-full sm:w-auto px-8 py-3 bg-[#c9b896] text-white rounded-lg hover:bg-[#b8a886] transition-colors font-medium whitespace-nowrap"
              >
                Write Review
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <div className="flex gap-2">
            {['all', 'tour', 'destination'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-6 py-2 rounded-full font-medium transition-colors capitalize ${
                  filterType === type
                    ? 'bg-[#c9b896] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#c9b896] border-t-transparent"></div>
          </div>
        ) : reviews.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6"
          >
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No reviews yet</p>
            <p className="text-gray-400 mt-2">Be the first to share your experience!</p>
          </motion.div>
        )}

        {/* Review Form Modal */}
        {selectedEntity && (
          <ReviewForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            type={selectedEntity.type}
            entityId={selectedEntity.id}
            entityName={selectedEntity.name}
            onSuccess={() => {
              fetchReviews()
              setSelectedEntity(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
