'use client'

import { motion } from 'framer-motion'
import StarRating from './StarRating'
import { formatDistanceToNow } from 'date-fns'

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'

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

interface ReviewCardProps {
  review: Review
  showStatus?: boolean
}

export default function ReviewCard({ review, showStatus = false }: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Profile Photo/Avatar */}
        <div className="flex-shrink-0">
          {review.profile_photo ? (
            <img
              src={`${API_BASE}/${review.profile_photo}`}
              alt={review.reviewer_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#c9b896]"
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#c9b896] to-[#a08968] flex items-center justify-center text-white font-semibold text-sm ${review.profile_photo ? 'hidden' : ''}`}>
            {getInitials(review.reviewer_name)}
          </div>
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.reviewer_name}</h4>
              <p className="text-sm text-gray-500">{getTimeAgo(review.created_at)}</p>
            </div>
            <StarRating rating={review.stars} size="sm" />
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {review.message}
          </p>

          {showStatus && review.status === 'pending' && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              Pending Approval
            </div>
          )}

          {showStatus && review.status === 'approved' && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Approved
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
