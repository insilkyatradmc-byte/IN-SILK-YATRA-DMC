'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { reviewsAPI } from '@/lib/api'
import StarRating from './StarRating'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import RatingStatistics from './RatingStatistics'
import { MessageSquare, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ReviewsSectionProps {
  type: 'tour' | 'destination'
  entityId: number
  entityName: string
}

interface Review {
  id: number
  reviewer_name: string
  reviewer_email?: string
  profile_photo?: string
  message: string
  stars: number
  created_at: string
  status: string
}

interface Statistics {
  total_reviews: number
  average_rating: number
  rating_distribution: {
    [key: number]: {
      count: number
      percentage: number
    }
  }
}

export default function ReviewsSection({ type, entityId, entityName }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    fetchData()
  }, [type, entityId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        reviewsAPI.getAll({ type, id: entityId, per_page: 50 }),
        reviewsAPI.getStatistics(type, entityId)
      ])

      if (reviewsRes.data.success) {
        setReviews(reviewsRes.data.data.data || [])
      }

      if (statsRes.data.success) {
        setStatistics(statsRes.data.data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#c9b896] border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16" id="reviews">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-serif text-white mb-2">Customer Reviews</h2>
            <p className="text-gray-400">
              See what travelers are saying about this {type}
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#c9b896] text-black rounded-lg hover:bg-[#b8a886] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Write Review
          </button>
        </div>

        {statistics && statistics.total_reviews > 0 ? (
          <div className="space-y-8">
            {/* Rating Statistics */}
            <RatingStatistics
              totalReviews={statistics.total_reviews}
              averageRating={statistics.average_rating}
              ratingDistribution={statistics.rating_distribution}
            />

            {/* Reviews List */}
            <div className="space-y-6">
              {displayedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Show More Button */}
            {reviews.length > 3 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="px-8 py-3 border border-[#c9b896] text-[#c9b896] rounded-lg hover:bg-[#c9b896] hover:text-black transition-colors font-medium"
                >
                  {showAllReviews 
                    ? 'Show Less' 
                    : `Show All ${reviews.length} Reviews`
                  }
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
            <p className="text-gray-400 mb-6">
              Be the first to share your experience!
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9b896] text-black rounded-lg hover:bg-[#b8a886] transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Write First Review
            </button>
          </div>
        )}

        {/* Review Form Modal */}
        <ReviewForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          type={type}
          entityId={entityId}
          entityName={entityName}
          onSuccess={() => {
            fetchData()
            toast.success('Thank you for your review! It will be visible after admin approval.')
          }}
        />
      </motion.div>
    </div>
  )
}
