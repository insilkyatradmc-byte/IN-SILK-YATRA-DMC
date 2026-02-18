

'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toursAPI, wishlistAPI } from '@/lib/api'
import { auth } from '@/lib/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Heart, 
  MessageCircle,
  ChevronLeft,
  Share2
} from 'lucide-react'
import { getImageUrl } from '@/lib/images'
import LoadingSpinner from '@/components/common/LoadingSpinner'


interface Tour {
  id: number
  title: string
  description: string
  price: number
  duration: number
  image?: string
  itinerary?: string
  inclusions?: string
  exclusions?: string
  destination?: {
    id: number
    name: string
  }
  in_wishlist?: boolean
}

export default function TourDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await api.get(`/tours/slug/${slug}`)
        const tourData = response.data.data
        setTour(tourData)
        setIsInWishlist(tourData.in_wishlist || false)
      } catch (error: any) {
        console.error('Error fetching tour:', error)
        if (error.response?.status === 404) {
          toast.error('Tour not found')
          router.push('/tours')
        } else {
          toast.error('Failed to load tour details')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [slug, router])

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])  // Reduced parallax for performance

  const handleAddToWishlist = async () => {
    if (!auth.isAuthenticated()) {
      sessionStorage.setItem('redirect_after_login', window.location.pathname)
      router.push('/login')
      toast.error('Please login to add to wishlist')
      return
    }

    if (!tour) return

    try {
      if (isInWishlist) {
        await wishlistAPI.remove(tour.id)
        setIsInWishlist(false)
        toast.success('Removed from wishlist')
      } else {
        await wishlistAPI.add(tour.id)
        setIsInWishlist(true)
        toast.success('Added to wishlist')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist')
    }
  }

  const handleWhatsApp = () => {
    // Ideally this comes from env or config
    const whatsappNumber = '77074227482' // Kazakhstan WhatsApp number
    const message = encodeURIComponent(
      `Hello In-Silk Yatra! I'm interested in booking the tour: "${tour?.title}". Could you please provide more details?`
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!tour) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-[#c9b896]/30">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a] z-10" />
          <img
            src={getImageUrl(tour.image, tour.title)}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              href="/tours" 
              className="inline-flex items-center text-sm text-[#c9b896] mb-6 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {tour.destination && (
                <span className="bg-[#c9b896]/10 text-[#c9b896] border border-[#c9b896]/30 px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-sm">
                  {tour.destination.name}
                </span>
              )}
              <span className="flex items-center text-gray-300 text-sm font-sans">
                <Clock className="w-4 h-4 mr-2" />
                {tour.duration} Days
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight max-w-4xl">
              {tour.title}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#111] p-8 rounded-xl border border-white/5"
            >
              <h2 className="text-2xl font-serif text-white mb-6">Experience Overview</h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                {tour.description}
              </p>
            </motion.div>

            {/* Itinerary */}
            {tour.itinerary && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#111] p-8 rounded-xl border border-white/5"
              >
                <h2 className="text-2xl font-serif text-white mb-6">Your Itinerary</h2>
                <div className="prose prose-invert prose-p:text-gray-400 prose-headings:font-serif prose-headings:text-white max-w-none whitespace-pre-line">
                  {tour.itinerary}
                </div>
              </motion.div>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tour.inclusions && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#111] p-6 rounded-xl border border-white/5"
                >
                  <h3 className="text-lg font-serif text-white mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                    Included
                  </h3>
                  <div className="text-gray-400 whitespace-pre-line text-sm leading-7">
                    {tour.inclusions}
                  </div>
                </motion.div>
              )}
              
              {tour.exclusions && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#111] p-6 rounded-xl border border-white/5"
                >
                  <h3 className="text-lg font-serif text-white mb-4 flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    Not Included
                  </h3>
                  <div className="text-gray-400 whitespace-pre-line text-sm leading-7">
                    {tour.exclusions}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#161616] p-8 rounded-xl border border-[#c9b896]/20 shadow-2xl"
              >
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-gray-400 text-sm block mb-1 font-sans">Starting from</span>
                    <span className="text-3xl font-sans font-bold text-white tracking-tight">${tour.price.toLocaleString()}</span>
                  </div>
                  <span className="bg-white/5 px-3 py-1 rounded text-sm text-gray-300 font-sans">
                    Per Person
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-400 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#c9b896] mr-3" />
                    Best Price Guarantee
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#c9b896] mr-3" />
                    Secure Payment
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#c9b896] mr-3" />
                    24/7 Expert Support
                  </div>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#c9b896] hover:bg-[#b8a685] text-black font-bold py-4 rounded-lg flex items-center justify-center transition-all transform hover:-translate-y-1 mb-3"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book via WhatsApp
                </button>
                
                <button
                  onClick={handleAddToWishlist}
                  className={`w-full py-3 rounded-lg font-medium border transition-all flex items-center justify-center ${
                    isInWishlist
                      ? 'bg-red-500/10 border-red-500/50 text-red-400'
                      : 'bg-transparent border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                  {isInWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>
              </motion.div>

              <div className="bg-[#111] p-6 rounded-xl border border-white/5 text-center">
                <p className="text-gray-400 text-sm mb-4">Have questions about this trip?</p>
                <a href="tel:+77074227482" className="text-white hover:text-[#c9b896] font-medium block font-sans">
                  +7 707 422 7482
                </a>
                <a href="mailto:info@insilkyatra.com" className="text-white hover:text-[#c9b896] font-medium block mt-1 font-sans">
                  info@insilkyatra.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
