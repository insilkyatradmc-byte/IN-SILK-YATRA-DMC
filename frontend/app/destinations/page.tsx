'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { destinationsAPI } from '@/lib/api'
import { getImageUrl } from '@/lib/images'
import { DestinationCardSkeleton } from '@/components/common/SkeletonCard'

interface Destination {
  id: number
  name: string
  slug: string
  description: string
  image?: string
  country: string
}

// Destination Card Component
function DestinationCard({ destination, index }: { destination: Destination; index: number }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })
  const [isHovered, setIsHovered] = useState(false)
  
  const imageUrl = getImageUrl(destination.image, destination.name)

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: 'easeOut' }}
    >
      <Link
        href={`/destinations/${destination.slug}`}
        className="group block relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        prefetch={true}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
          {/* Image */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <img
              src={imageUrl}
              alt={destination.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70" />

          {/* Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="transition-transform duration-300 ease-out" style={{ transform: isHovered ? 'translateX(10px)' : 'translateX(0)' }}>
              {/* Country Tag */}
              <div className="inline-block mb-4">
                <span className="text-xs tracking-[0.3em] text-white/70 uppercase font-mono">
                  {destination.country}
                </span>
              </div>

              {/* Destination Name */}
              <h3 className="text-3xl md:text-4xl font-serif text-white mb-3 leading-tight">
                {destination.name}
              </h3>

              {/* Description */}
              <p className="text-white/80 text-sm leading-relaxed line-clamp-2 mb-6 transition-opacity duration-300" style={{ opacity: isHovered ? 1 : 0.7 }}>
                {destination.description}
              </p>

              {/* Explore Link */}
              <div className="flex items-center gap-3">
                <span className="text-[#c9b896] text-sm tracking-[0.2em] uppercase font-medium">
                  Explore
                </span>
                <div className="h-px bg-[#c9b896] transition-all duration-300" style={{ width: isHovered ? '80px' : '48px' }} />
              </div>
            </div>
          </div>

          {/* Corner Accent */}
          {isHovered && (
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#c9b896]/30 animate-in fade-in duration-300" />
          )}
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

      {/* Destinations Grid */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <DestinationCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredDestinations.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                />
              ))}
            </motion.div>
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
