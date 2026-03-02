'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import ReviewCard from '@/components/common/ReviewCard'
import StarRating from '@/components/common/StarRating'
import { reviewsAPI, toursAPI, destinationsAPI } from '@/lib/api'
import { MessageSquare, Star, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'

// Lazy load ReviewForm modal (only when user opens it)
const ReviewForm = dynamic(() => import('@/components/common/ReviewForm'), {
  loading: () => <div>Loading...</div>,
  ssr: false
})

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
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [entities, setEntities] = useState<EntityOption[]>([])
  const [selectedType, setSelectedType] = useState<'tour' | 'destination' | ''>('')
  const [selectedEntity, setSelectedEntity] = useState<EntityOption | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'tour' | 'destination'>('all')

  useEffect(() => {
    setCurrentPage(1)
    setReviews([])
    setHasMore(true)
    fetchReviews(1)
    fetchEntities()
  }, [filterType])

  const fetchReviews = async (page: number = 1) => {
    if (page === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    
    try {
      const params: any = { per_page: 12, page }
      if (filterType !== 'all') {
        params.type = filterType
      }
      
      const response = await reviewsAPI.getAll(params)
      if (response.data.success) {
        const newReviews = response.data.data.data || []
        const pagination = response.data.data
        
        if (page === 1) {
          setReviews(newReviews)
        } else {
          setReviews(prev => [...prev, ...newReviews])
        }
        
        // Check if there are more pages
        setHasMore(pagination.current_page < pagination.last_page)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreReviews = () => {
    if (!loadingMore && hasMore) {
      fetchReviews(currentPage + 1)
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
    <div className="min-h-screen bg-[#e8e6e1] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-gray-900 mb-6 font-light tracking-wide">
            Reviews
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Discover what our travelers have to say about their journeys across Central Asia
          </p>
        </motion.div>

        {/* Write Review Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg p-8 md:p-10 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3 font-light">
              Share Your Journey
            </h2>
            <p className="text-gray-600 font-light">
              Your experience matters — help others discover their perfect adventure
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <style jsx>{`
              select option:not([disabled]) {
                padding: 12px 16px;
                font-size: 15px;
                line-height: 1.6;
                color: #374151;
              }
              select option:not([disabled]):checked {
                background: linear-gradient(0deg, #1f2937 0%, #1f2937 100%);
                color: #9ca3af;
              }
              select optgroup {
                background: #f9fafb;
                font-weight: 500;
                font-size: 13px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: #6b7280;
                padding: 8px 16px;
              }
              @media (max-width: 640px) {
                select option:not([disabled]) {
                  padding: 16px;
                  font-size: 16px;
                }
              }
            `}</style>
            {/* Step 1: Select Type */}
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as 'tour' | 'destination' | '')
                setSelectedEntity(null) // Reset entity when type changes
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234b5563' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 1.25rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
              className="w-full sm:flex-1 appearance-none px-5 pr-14 py-4 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all text-gray-800 cursor-pointer hover:border-gray-400 text-base"
            >
              <option value="" disabled className="text-gray-400">Select Type</option>
              <option value="tour">Tour</option>
              <option value="destination">Destination</option>
            </select>

            {/* Step 2: Select Specific Entity (only show when type is selected) */}
            {selectedType && (
              <select
                value={selectedEntity?.id || ''}
                onChange={(e) => {
                  const entity = entities.find(ent => 
                    ent.id === parseInt(e.target.value) && ent.type === selectedType
                  )
                  setSelectedEntity(entity || null)
                }}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234b5563' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1.25rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                }}
                className="w-full sm:flex-1 appearance-none px-5 pr-14 py-4 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all text-gray-800 cursor-pointer hover:border-gray-400 text-base"
              >
                <option value="" disabled className="text-gray-400">
                  Select {selectedType === 'tour' ? 'Tour' : 'Destination'}
                </option>
                {entities
                  .filter(e => e.type === selectedType)
                  .map(entity => (
                    <option key={`${entity.type}-${entity.id}`} value={entity.id}>
                      {entity.name}
                    </option>
                  ))}
              </select>
            )}

            <button
              onClick={handleWriteReview}
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-light tracking-wide whitespace-nowrap"
            >
              Write Review
            </button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          {['all', 'tour', 'destination'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-8 py-2.5 rounded-full font-light tracking-wide transition-all capitalize text-sm ${
                filterType === type
                  ? 'bg-gray-900 text-white'
                  : 'bg-white/60 text-gray-700 hover:bg-white border border-gray-300'
              }`}
            >
                {type}
              </button>
          ))}
        </motion.div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900"></div>
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className="grid gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.3 }}
                >
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={loadMoreReviews}
                  disabled={loadingMore}
                  className="px-10 py-3.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Loading
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-serif text-3xl text-gray-900 mb-2 font-light">No reviews yet</h3>
            <p className="text-gray-500 font-light">Be the first to share your journey</p>
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
              fetchReviews(1)
              setSelectedEntity(null)
              setSelectedType('')
            }}
          />
        )}
      </div>
    </div>
  )
}
