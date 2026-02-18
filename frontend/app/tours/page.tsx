'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { toursAPI } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import { getImageUrl } from '@/lib/images'
import { Clock, ArrowUpRight } from 'lucide-react'
import { TourCardSkeleton } from '@/components/common/SkeletonCard'

interface Tour {
  id: number
  title: string
  slug: string
  description: string
  price: number
  duration: number
  image?: string
  destination?: {
    id: number
    name: string
  }
}

// Enhanced Tour Card Component
function TourCard({ tour, index }: { tour: Tour; index: number }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.2 })
  const [isHovered, setIsHovered] = useState(false)
  
  const imageUrl = getImageUrl(tour.image, tour.title)

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: 'easeOut' }}
    >
      <Link
        href={`/tours/${tour.slug}`}
        className="group block relative overflow-hidden bg-[#0a0a0a]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        prefetch={true}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Image with Parallax-like scale effect on hover */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <img
              src={imageUrl}
              alt={tour.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60" />

          {/* Top Destination Tag */}
          <div className="absolute top-6 left-6 z-20">
             {tour.destination && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5">
                  <span className="text-xs tracking-[0.2em] uppercase font-medium text-white">
                    {tour.destination.name}
                  </span>
                </div>
             )}
          </div>

          {/* Floating Action Button */}
          <motion.div 
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center bg-black/20 backdrop-blur-sm shadow-lg overflow-hidden group"
            animate={{ 
               backgroundColor: isHovered ? '#c9b896' : 'rgba(0,0,0,0.2)',
               borderColor: isHovered ? '#c9b896' : 'rgba(255,255,255,0.3)',
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight className={`w-5 h-5 transition-colors duration-300 ${isHovered ? 'text-black' : 'text-white'}`} />
          </motion.div>

          {/* Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
            <div>
              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">
                {tour.title}
              </h3>

              {/* Price & Duration Row */}
              <div className="flex items-center gap-6 mt-4 border-t border-white/20 pt-4">
                <div className="flex flex-col">
                   <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Price</span>
                   <span className="text-lg font-sans font-medium text-[#c9b896]">${tour.price.toLocaleString()}</span>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="flex flex-col">
                   <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Duration</span>
                   <div className="flex items-center text-white/90">
                      <Clock className="w-3 h-3 mr-2 text-[#c9b896]" />
                      <span className="text-sm font-sans">{tour.duration} Days</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Border Animation on Hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 border-2 border-[#c9b896]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: 'none' }}
            />
          )}
        </div>
      </Link>
    </motion.div>
  )
}

function ToursContent() {
  const searchParams = useSearchParams()
  const initialDestinationId = searchParams.get('destination_id')
  
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('All')

  // Hero Parallax Setup
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await toursAPI.getAll()
        setTours(response.data.data)
      } catch (error) {
        console.error('Error fetching tours:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTours()
  }, [])

  // Derive unique destinations for filter
  const uniqueDestinations = ['All', ...Array.from(new Set(tours.map(t => t.destination?.name).filter(Boolean)))] as string[]

  const filteredTours = activeFilter === 'All' 
    ? tours 
    : tours.filter(t => t.destination?.name === activeFilter)

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[85vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
           {/* High quality travel abstract */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60 z-10" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="mb-6 flex justify-center">
              <span className="text-[#c9b896] tracking-[0.3em] uppercase text-xs md:text-sm border-y border-[#c9b896]/30 py-3 px-6">
                Curated Expeditions
              </span>
           </div>

           <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl mb-8 tracking-tight text-white">
              THE ART OF <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e8dcb8] to-[#c9b896]">TRAVEL</span>
           </h1>

           <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Discover our collection of exclusive journeys designed for the modern explorer seeking depth and elegance.
           </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex overflow-x-auto py-6 gap-8 no-scrollbar md:justify-center">
              {uniqueDestinations.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-sm tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap relative group ${
                    activeFilter === filter ? 'text-[#c9b896]' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {filter}
                  <span className={`absolute -bottom-2 left-0 h-px bg-[#c9b896] transition-all duration-300 ${
                    activeFilter === filter ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
         <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <TourCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredTours.map((tour, index) => (
                    <TourCard key={tour.id} tour={tour} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            
            {!loading && filteredTours.length === 0 && (
                <div className="text-center py-20">
                   <p className="text-white/40 font-serif text-xl">No journeys found in this category.</p>
                </div>
            )}
         </div>
      </section>
    </div>
  )
}

export default function ToursPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#0a0a0a] min-h-screen">
        <div className="py-24 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <TourCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    }>
      <ToursContent />
    </Suspense>
  )
}
