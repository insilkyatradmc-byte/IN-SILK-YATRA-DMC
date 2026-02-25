'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { destinationsAPI } from '@/lib/api'
import { getImageUrl } from '@/lib/images'

interface Destination {
  id: number
  name: string
  slug: string
  description: string
  image?: string
  country: string
}

function DestinationCard({ destination, index, className, gridSize }: { destination: Destination; index: number; className?: string; gridSize?: 'large' | 'medium' | 'small' }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.1 })
  const [isHovered, setIsHovered] = useState(false)
  
  const imageUrl = getImageUrl(destination.image, destination.name)

  // Determine height based on grid size
  const heightClass = gridSize === 'large' 
    ? 'min-h-[450px] md:min-h-[550px]' 
    : gridSize === 'medium'
    ? 'min-h-[400px] md:min-h-[500px]'
    : 'min-h-[350px] md:min-h-[450px]'

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      className={`h-full ${className}`}
    >
      <Link
        href={`/destinations/${destination.slug}`}
        className="group block relative overflow-hidden h-full rounded-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        prefetch={true}
      >
        <div className={`relative w-full h-full overflow-hidden bg-gray-900 ${heightClass}`}>
          {/* Image with Enlarge Effect - stays within container */}
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
              {/* Country Tag - Shows on Hover */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 mb-3"
              >
                <span className="h-px w-8 bg-[#c9b896]" />
                <span className="text-xs tracking-[0.2em] text-[#c9b896] uppercase font-mono font-semibold">
                  {destination.country}
                </span>
              </motion.div>

              {/* Destination Name */}
              <h3 className={`font-serif text-white mb-4 leading-tight ${
                gridSize === 'large' ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'
              }`}>
                {destination.name}
              </h3>

              {/* EXPLORE Button - Shows on Hover */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#c9b896] hover:bg-[#d4c4a8] text-black font-medium text-sm rounded-full transition-colors duration-300">
                  <span className="tracking-[0.15em] uppercase font-bold">Explore</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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

export default function DestinationsShowcase() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationsAPI.getAll()
        // The API returns { data: { data: [...] } } or { data: [...] } depending on pagination/wrapper
        const destinationsData = response.data?.data || response.data || []
        setDestinations(Array.isArray(destinationsData) ? destinationsData : [])
      } catch (error) {
        console.error('Failed to fetch destinations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  if (isLoading || destinations.length === 0) {
    return null; // Or a loading skeleton if preferred
  }

  // Show 4 destinations initially (2 full rows of 2), plus 2 more with fade effect
  const displayedDestinations = showAll ? destinations : destinations.slice(0, 4)
  const previewDestinations = showAll ? [] : destinations.slice(4, 6)

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#c9b896]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#c9b896]/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#c9b896] text-sm tracking-[0.3em] uppercase font-mono mb-4 block"
          >
            Discover The Extraordinary
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-white"
          >
            Curated Destinations
          </motion.h2>
        </div>

        <div className="relative">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {displayedDestinations.map((destination, index) => {
                // 2 cards per row: Row 1: [Wide, Small], Row 2: [Small, Wide], repeat
                let gridClassName = "col-span-1"
                let gridSize: 'large' | 'medium' | 'small' = 'small'
                
                const positionInRow = index % 2  // 2 items per row (0, 1)
                const rowNumber = Math.floor(index / 2)
                const isEvenRow = rowNumber % 2 === 0
                
                if (isEvenRow) {
                  // Even rows: [Wide (2 cols), Small (1 col)]
                  if (positionInRow === 0) {
                    gridClassName = "md:col-span-2 lg:col-span-2"
                    gridSize = 'large'
                  } else {
                    gridClassName = "md:col-span-1 lg:col-span-1"
                    gridSize = 'small'
                  }
                } else {
                  // Odd rows: [Small (1 col), Wide (2 cols)]
                  if (positionInRow === 0) {
                    gridClassName = "md:col-span-1 lg:col-span-1"
                    gridSize = 'small'
                  } else {
                    gridClassName = "md:col-span-2 lg:col-span-2"
                    gridSize = 'large'
                  }
                }

                return (
                  <div key={destination.id} className={gridClassName}>
                    <DestinationCard 
                      destination={destination} 
                      index={index}
                      gridSize={gridSize}
                    />
                  </div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {/* Preview Row with Fade/Blur Effect */}
          {!showAll && previewDestinations.length > 0 && (
            <div className="relative mt-6">
              {/* Fade overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10 pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 blur-sm"
              >
                {previewDestinations.map((destination, index) => {
                  const baseIndex = 4 + index
                  const positionInRow = baseIndex % 2  // 2 items per row
                  const rowNumber = Math.floor(baseIndex / 2)
                  const isEvenRow = rowNumber % 2 === 0
                  
                  let gridClassName = "col-span-1"
                  let gridSize: 'large' | 'medium' | 'small' = 'small'
                  
                  if (isEvenRow) {
                    if (positionInRow === 0) {
                      gridClassName = "md:col-span-2 lg:col-span-2"
                      gridSize = 'large'
                    } else {
                      gridClassName = "md:col-span-1 lg:col-span-1"
                      gridSize = 'small'
                    }
                  } else {
                    if (positionInRow === 0) {
                      gridClassName = "md:col-span-1 lg:col-span-1"
                      gridSize = 'small'
                    } else {
                      gridClassName = "md:col-span-2 lg:col-span-2"
                      gridSize = 'large'
                    }
                  }

                  return (
                    <div key={`preview-${destination.id}`} className={gridClassName}>
                      <DestinationCard 
                        destination={destination} 
                        index={baseIndex}
                        gridSize={gridSize}
                      />
                    </div>
                  )
                })}
              </motion.div>
            </div>
          )}
        </div>

        {destinations.length > 4 && (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center relative z-20"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="group relative px-12 py-4 bg-transparent border-2 border-white/20 text-white overflow-hidden rounded-lg transition-all duration-300 hover:border-[#c9b896] shadow-xl"
            >
              <div className="absolute inset-0 bg-[#c9b896] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 text-sm tracking-[0.15em] uppercase font-bold group-hover:text-black transition-colors duration-300">
                {showAll ? '← Show Less' : 'Show more'}
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
