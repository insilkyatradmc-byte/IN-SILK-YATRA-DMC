'use client'

import StarRating from './StarRating'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'

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
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg p-8 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-6">
        {/* Profile Photo/Avatar */}
        <div className="flex-shrink-0 relative">
          {review.profile_photo ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200">
              <Image
                src={`${API_BASE}/${review.profile_photo}`}
                alt={review.reviewer_name}
                fill
                className="object-cover"
                sizes="64px"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.nextElementSibling?.classList.remove('hidden');
                }}
              />
            </div>
          ) : null}
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-light text-lg ${review.profile_photo ? 'hidden' : ''}`}>
            {getInitials(review.reviewer_name)}
          </div>
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h4 className="font-serif text-xl text-gray-900 mb-1">{review.reviewer_name}</h4>
              <p className="text-sm text-gray-500 font-light">{getTimeAgo(review.created_at)}</p>
            </div>
            <StarRating rating={review.stars} size="sm" />
          </div>

          <p className="text-gray-700 leading-relaxed font-light text-base whitespace-pre-line">
            {review.message}
          </p>

          {showStatus && review.status === 'pending' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-light">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
              Pending Approval
            </div>
          )}

          {showStatus && review.status === 'approved' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-light">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              Approved
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
