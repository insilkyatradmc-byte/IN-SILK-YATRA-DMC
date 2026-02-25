'use client'

import { motion } from 'framer-motion'
import StarRating from './StarRating'
import { Star } from 'lucide-react'

interface RatingDistribution {
  [key: number]: {
    count: number
    percentage: number
  }
}

interface RatingStatisticsProps {
  totalReviews: number
  averageRating: number
  ratingDistribution: RatingDistribution
}

export default function RatingStatistics({
  totalReviews,
  averageRating,
  ratingDistribution
}: RatingStatisticsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>

      <div className="flex items-start gap-8 mb-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={averageRating} size="md" />
          <p className="text-sm text-gray-600 mt-2">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const data = ratingDistribution[stars] || { count: 0, percentage: 0 }
            
            return (
              <div key={stars} className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 text-sm text-gray-700 w-16">
                  <span>{stars}</span>
                  <Star className="w-4 h-4 fill-[#c9b896] text-[#c9b896]" />
                </div>
                
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percentage}%` }}
                    transition={{ duration: 0.8, delay: stars * 0.1 }}
                    className="h-full bg-[#c9b896] rounded-full"
                  />
                </div>
                
                <span className="text-sm text-gray-600 w-12 text-right">
                  {data.percentage}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review Breakdown */}
      <div className="border-t border-gray-100 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#c9b896]">
              {ratingDistribution[5]?.percentage || 0}%
            </div>
            <div className="text-sm text-gray-600">5 Star</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#c9b896]">
              {((ratingDistribution[4]?.percentage || 0) + (ratingDistribution[5]?.percentage || 0))}%
            </div>
            <div className="text-sm text-gray-600">4+ Star</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {totalReviews}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
