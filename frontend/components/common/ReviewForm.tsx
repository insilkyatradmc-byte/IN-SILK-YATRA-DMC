'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import StarRating from './StarRating'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface ReviewFormProps {
  type: 'tour' | 'destination'
  entityId: number
  entityName: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function ReviewForm({
  type,
  entityId,
  entityName,
  isOpen,
  onClose,
  onSuccess
}: ReviewFormProps) {
  const [formData, setFormData] = useState({
    reviewer_name: '',
    reviewer_email: '',
    message: '',
    stars: 5
  })
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('type', type)
      formDataToSend.append('id', entityId.toString())
      formDataToSend.append('reviewer_name', formData.reviewer_name)
      formDataToSend.append('reviewer_email', formData.reviewer_email)
      formDataToSend.append('message', formData.message)
      formDataToSend.append('stars', formData.stars.toString())
      
      if (profilePhoto) {
        formDataToSend.append('profile_photo', profilePhoto)
      }

      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Review submitted successfully! It will appear after admin approval.')
        setFormData({ reviewer_name: '', reviewer_email: '', message: '', stars: 5 })
        setProfilePhoto(null)
        onSuccess?.()
        onClose()
      } else {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ')
          toast.error(errorMessages)
        } else {
          toast.error(data.message || 'Failed to submit review')
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#e8e6e1] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-8 flex items-center justify-between z-10">
          <div>
            <h2 className="font-serif text-3xl text-gray-900 font-light mb-2">Write a Review</h2>
            <p className="text-sm text-gray-600 font-light">Share your experience with {entityName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
          {/* Rating */}
          <div>
            <label className="block text-sm font-light text-gray-700 mb-3 tracking-wide">
              Your Rating <span className="text-gray-900">*</span>
            </label>
            <StarRating
              rating={formData.stars}
              size="lg"
              interactive
              onRatingChange={(rating) => setFormData(prev => ({ ...prev, stars: rating }))}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
              Your Name <span className="text-gray-900">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.reviewer_name}
              onChange={(e) => setFormData(prev => ({ ...prev, reviewer_name: e.target.value }))}
              className="w-full px-5 py-3.5 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all text-gray-800 font-light"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
              Email (Optional)
            </label>
            <input
              type="email"
              value={formData.reviewer_email}
              onChange={(e) => setFormData(prev => ({ ...prev, reviewer_email: e.target.value }))}
              className="w-full px-5 py-3.5 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all text-gray-800 font-light"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
              Profile Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
              className="w-full px-5 py-3.5 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all text-gray-800 font-light file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:bg-gray-900 file:text-white hover:file:bg-gray-800 file:cursor-pointer file:font-light file:text-sm"
            />
          </div>

          {/* Review Message */}
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
              Your Review <span className="text-gray-900">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-5 py-3.5 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all resize-none text-gray-800 font-light leading-relaxed"
              placeholder="Tell us about your experience... (minimum 10 characters)"
              minLength={10}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-light tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-3.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center pt-3 font-light">
            Your review will be published after admin approval
          </p>
        </form>
      </motion.div>
    </div>
  )
}
