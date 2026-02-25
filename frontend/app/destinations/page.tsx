'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { destinationsAPI } from '@/lib/api'
import { getImageUrl } from '@/lib/images'
import { DestinationCardSkeleton } from '@/components/common/SkeletonCard'
import WhyChooseUs from '@/components/home/WhyChooseUs'

interface Destination {
  id: number
  name: string
  slug: string
  description: string
  image?: string
  country: string
}

// Destination Card Component with Mixed Grid support
function DestinationCard({ destination, index, gridSize }: { destination: Destination; index: number; gridSize?: 'large' | 'medium' | 'small' }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.2 })
  const [isHovered, setIsHovered] = useState(false)
  
  const imageUrl = getImageUrl(destination.image, destination.name)

  // Determine height based on grid size
  const heightClass = gridSize === 'large' 
    ? 'h-[500px] md:h-[600px]' 
    : gridSize === 'medium'
    ? 'h-[400px] md:h-[500px]'
    : 'h-[350px] md:h-[450px]'

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4), ease: 'easeOut' }}
      className="h-full"
    >
      <Link
        href={`/destinations/${destination.slug}`}
        className="group block relative overflow-hidden rounded-2xl h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        prefetch={true}
      >
        <div className={`relative ${heightClass} overflow-hidden bg-gray-900`}>
          {/* Image with Enlarge Effect */}
          <motion.div
            className="absolute inset-[-10%]"
            animate={{ 
              scale: isHovered ? 1.15 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img
              src={imageUrl}
              alt={destination.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Content - Always Visible */}
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            <motion.div
              animate={{ 
                y: isHovered ? -10 : 0,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Destination Name */}
              <h3 className={`font-serif text-white mb-4 leading-tight ${
                gridSize === 'large' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
              }`}>
                {destination.name}
              </h3>

              {/* Request Button - Shows on Hover */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#c9b896] hover:bg-[#d4c4a8] text-black font-medium text-sm rounded-full transition-colors duration-300">
                  <span className="tracking-[0.1em] uppercase">Request a Tour</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Corner Brackets on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/30" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCountry, setActiveCountry] = useState<string | null>(null)
  
  // Removed heavy scroll transforms for better performance

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationsAPI.getAll()
        setDestinations(response.data.data)
      } catch (error) {
        console.error('Error fetching destinations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const countries = ['Kazakhstan', 'Kyrgyzstan', 'Azerbaijan']
  const filteredDestinations = activeCountry
    ? destinations.filter((d) => d.country === activeCountry)
    : destinations

  const groupedDestinations = countries.map((country) => ({
    country,
    destinations: destinations.filter((d) => d.country === country),
  }))

  return (
    <div className="bg-black">
      {/* Hero Section - Simplified */}
      <section className="relative h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url(https://res.cloudinary.com/dzbk92wsh/image/upload/v1770216435/visitalmatykz-visitalmaty-3457152_1920_vijloz.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center max-w-5xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-px bg-[#c9b896] mx-auto mb-8"
            />
            
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white mb-8 leading-none tracking-tight">
              DESTINATIONS
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-white/70 text-lg md:text-xl tracking-[0.3em] uppercase font-mono"
            >
              Where Journey Becomes Legacy
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Country Filter Section */}
      <section className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            <button
              onClick={() => setActiveCountry(null)}
              className={`px-6 py-2 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                activeCountry === null
                  ? 'text-[#c9b896] border-b-2 border-[#c9b896]'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              All
            </button>
            {countries.map((country) => {
              const count = groupedDestinations.find((g) => g.country === country)?.destinations.length || 0
              return (
                <button
                  key={country}
                  onClick={() => setActiveCountry(country)}
                  className={`px-6 py-2 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                    activeCountry === country
                      ? 'text-[#c9b896] border-b-2 border-[#c9b896]'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {country}
                  <span className="ml-2 text-xs opacity-50">({count})</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Destinations Grid - Mixed Layout */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <DestinationCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredDestinations.length > 0 ? (
            <div className="relative">
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredDestinations.map((destination, index) => {
                  // 2 cards per row: Row 1: [Wide, Small], Row 2: [Small, Wide], repeat
                  let gridClass = 'col-span-1'
                  let gridSize: 'large' | 'medium' | 'small' = 'small'
                  
                  const positionInRow = index % 2  // 2 items per row (0, 1)
                  const rowNumber = Math.floor(index / 2)
                  const isEvenRow = rowNumber % 2 === 0
                  
                  if (isEvenRow) {
                    // Even rows: [Wide (2 cols), Small (1 col)]
                    if (positionInRow === 0) {
                      gridClass = 'md:col-span-2 lg:col-span-2'
                      gridSize = 'large'
                    } else {
                      gridClass = 'md:col-span-1 lg:col-span-1'
                      gridSize = 'small'
                    }
                  } else {
                    // Odd rows: [Small (1 col), Wide (2 cols)]
                    if (positionInRow === 0) {
                      gridClass = 'md:col-span-1 lg:col-span-1'
                      gridSize = 'small'
                    } else {
                      gridClass = 'md:col-span-2 lg:col-span-2'
                      gridSize = 'large'
                    }
                  }
                  
                  return (
                    <div key={destination.id} className={gridClass}>
                      <DestinationCard
                        destination={destination}
                        index={index}
                        gridSize={gridSize}
                      />
                    </div>
                  )
                })}
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <p className="text-white/50 text-lg">
                No destinations found for {activeCountry}.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Bottom CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#c9b896]/10 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">
              Ready to Explore<br />Central Asia?
            </h2>
            <p className="text-white/60 text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
              Let us craft a bespoke journey through the ancient Silk Road,
              tailored to your dreams and desires.
            </p>
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center px-12 py-4 border-2 border-[#c9b896] text-[#c9b896] font-medium text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 hover:text-black"
            >
              <span className="relative z-10">Start Your Journey</span>
              <span className="absolute inset-0 bg-[#c9b896] transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
