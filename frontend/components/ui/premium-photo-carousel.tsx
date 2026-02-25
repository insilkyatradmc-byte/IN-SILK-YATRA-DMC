'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PhotoCarouselProps {
  images: string[]
  autoPlayDelay?: number
}

export default function PremiumPhotoCarousel({ images, autoPlayDelay = 5000 }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    // Don't start timer if no images
    if (!images || images.length === 0) return

    const timer = setInterval(() => {
      handleNext()
    }, autoPlayDelay)

    return () => clearInterval(timer)
  }, [currentIndex, autoPlayDelay, images])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  }

  // Safety check - render placeholder if no images
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[600px] overflow-hidden rounded-lg bg-gray-900 flex items-center justify-center">
        <p className="text-white/60">No photos available</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg group">
      {/* Main Image Container */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt={`Travel moment ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous photo"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next photo"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-[#c9b896]'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>

      {/* Photo Counter */}
      <div className="absolute top-6 right-6 z-10 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-light">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}
