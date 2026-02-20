

'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { destinationsAPI, toursAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  MapPin, 
  ArrowRight, 
  ChevronLeft
} from 'lucide-react'
import { getImageUrl } from '@/lib/images'
import LoadingSpinner from '@/components/common/LoadingSpinner'

// Helper for image URLs
// const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'

// Removed local helper in favor of import

interface Destination {
  id: number
  name: string
  description: string
  country: string
  image?: string
}

interface Tour {
  id: number
  title: string
  slug: string
  description: string
  price: number
  duration: number
  image?: string
}

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [destination, setDestination] = useState<Destination | null>(null)
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destinationsResponse = await destinationsAPI.getAll()
        const foundDestination = destinationsResponse.data.data.find(
          (d: any) => d.slug === slug
        )

        if (foundDestination) {
          setDestination(foundDestination)
          const toursResponse = await toursAPI.getAll({
            destination_id: foundDestination.id,
          })
          setTours(toursResponse.data.data)
        } else {
          toast.error('Destination not found')
          router.push('/destinations')
        }
      } catch (error) {
        console.error('Error fetching destination:', error)
        toast.error('Failed to load destination')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, router])

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])  // Reduced parallax for performance
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!destination) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#c9b896]/30">
      {/* Parallax Hero */}
      <div className="relative h-screen overflow-hidden">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#0a0a0a] z-10" />
          <img
            src={getImageUrl(destination.image, destination.name)}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Link 
              href="/destinations" 
              className="group inline-flex items-center text-sm font-medium text-[#c9b896] mb-6 hover:text-[#b8a685] transition-colors"
            >
              {/* @ts-ignore - Lucide React 18 type compatibility */}
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Destinations
            </Link>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-4 tracking-tight">
              {destination.name}
            </h1>
            <div className="flex items-center space-x-4 text-lg text-gray-300">
              <span className="flex items-center">
                {/* @ts-ignore - Lucide React 18 type compatibility */}
                <MapPin className="w-5 h-5 mr-2 text-[#c9b896]" />
                {destination.country}
              </span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span className="text-[#c9b896] font-medium">
                {tours.length} Active Tours
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-30 -mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#111] p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm"
            >
              <h2 className="text-3xl font-serif mb-6 text-white">About {destination.name}</h2>
              <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </motion.div>
            
            {/* Associated Tours */}
            <div className="mt-20">
              <h2 className="text-3xl font-serif mb-8 flex items-center">
                <span className="w-8 h-[1px] bg-[#c9b896] mr-4"></span>
                Curated Experiences
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tours.map((tour, index) => (
                  <TourCard key={tour.id} tour={tour} index={index} />
                ))}
              </div>

              {tours.length === 0 && (
                <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-gray-500">
                  No specific tours listed for this destination yet. 
                  <br />
                  <Link href="/contact" className="text-[#c9b896] hover:underline mt-2 inline-block">
                    Contact us specifically for a custom inquiry
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#111] p-8 rounded-2xl border border-white/5 sticky top-24">
              <h3 className="text-xl font-serif mb-6 text-white">Why {destination.name}?</h3>
              <ul className="space-y-4">
                {[
                  'Hand-picked luxury accommodations',
                  'Exclusive access to hidden gems',
                  'Expert local guides',
                  'Premium transport services',
                  '24/7 Concierge support'
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-gray-400">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#c9b896] mt-2 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <Link
                  href="/contact"
                  className="block w-full bg-[#c9b896] text-black font-semibold text-center py-4 rounded-lg hover:bg-[#b8a685] transition-colors"
                >
                  Plan Your Trip
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TourCard({ tour, index }: { tour: Tour; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/tours/${tour.slug}`} className="group block h-full">
        <div className="bg-[#161616] rounded-xl overflow-hidden border border-white/5 hover:border-[#c9b896]/30 transition-all duration-300 h-full flex flex-col">
          <div className="h-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
            <img
              src={getImageUrl(tour.image, tour.title)}
              alt={tour.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10 font-sans tracking-wide">
              {tour.duration} Days
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-xl font-medium text-white mb-2 group-hover:text-[#c9b896] transition-colors line-clamp-2">
              {tour.title}
            </h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
              {tour.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <span className="text-lg font-sans font-medium text-white">
                ${tour.price.toLocaleString()}
              </span>
              <span className="text-sm text-[#c9b896] flex items-center group-hover:translate-x-1 transition-transform">
                Details <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
