"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

interface TestimonialData {
  id: number
  name: string
  content: string
  country: string | null
  photo: string | null
  gallery_photos?: string[] | null // New field for additional photos
}

interface CleanTestimonialProps {
  testimonials: TestimonialData[]
}

function usePreloadImages(images: string[]) {
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [images])
}

function SplitText({ text }: { text: string }) {
  const words = text.split(" ")

  return (
    <span className="inline">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

export function CleanTestimonial({ testimonials }: CleanTestimonialProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isHoveredOnGallery, setIsHoveredOnGallery] = useState(false)
  const [isHoveredOnLightbox, setIsHoveredOnLightbox] = useState(false)
  const [isHoveredInLightboxArea, setIsHoveredInLightboxArea] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'
  const getPhotoUrl = (photo: string) =>
    photo.startsWith('http') ? photo : `${API_BASE}${photo}`

  usePreloadImages(
    testimonials
      .filter((t) => t.photo)
      .map((t) => getPhotoUrl(t.photo!))
  )

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY],
  )

  const handleNext = () => {
    // If hovering over gallery, open first photo instead of going to next testimonial
    if (isHoveredOnGallery) {
      openLightbox(0)
    } else {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }
  }

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setIsHoveredOnLightbox(false)
    setIsHoveredInLightboxArea(false)
  }, [])

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => {
      const currentTestimonial = testimonials[activeIndex]
      const galleryPhotos = currentTestimonial.gallery_photos || []
      return (prev + 1) % galleryPhotos.length
    })
  }, [testimonials, activeIndex])

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => {
      const currentTestimonial = testimonials[activeIndex]
      const galleryPhotos = currentTestimonial.gallery_photos || []
      return (prev - 1 + galleryPhotos.length) % galleryPhotos.length
    })
  }, [testimonials, activeIndex])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage()
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, closeLightbox, prevLightboxImage, nextLightboxImage])

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="relative w-full max-w-xl mx-auto py-20 px-8 text-center">
        <p className="text-testimonial-muted">No testimonials available at the moment.</p>
      </div>
    )
  }

  const currentTestimonial = testimonials[activeIndex]

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto py-20 px-8"
      style={{ cursor: "none" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!lightboxOpen ? handleNext : undefined}
    >
      {/* Custom magnetic cursor */}
      <motion.div
        className="pointer-events-none absolute z-[100]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white flex items-center justify-center shadow-lg"
          animate={{
            width: (lightboxOpen ? isHoveredInLightboxArea : isHovered) ? 80 : 0,
            height: (lightboxOpen ? isHoveredInLightboxArea : isHovered) ? 80 : 0,
            opacity: (lightboxOpen ? isHoveredInLightboxArea : isHovered) ? 1 : 0,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        >
          {lightboxOpen && isHoveredOnLightbox ? (
            <motion.svg
              className="w-6 h-6 text-black"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </motion.svg>
          ) : isHoveredOnGallery ? (
            <motion.svg
              className="w-6 h-6 text-black"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </motion.svg>
          ) : (
            <motion.span
              className="text-black text-xs font-medium tracking-wider uppercase"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.1 }}
            >
              Next
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Floating index indicator */}
      <motion.div
        className="absolute top-8 right-8 flex items-baseline gap-1 font-mono text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span
          className="text-2xl font-light text-testimonial-foreground"
          key={activeIndex}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {String(activeIndex + 1).padStart(2, "0")}
        </motion.span>
        <span className="text-testimonial-muted">/</span>
        <span className="text-testimonial-muted">{String(testimonials.length).padStart(2, "0")}</span>
      </motion.div>

      {/* Stacked avatar previews for other testimonials */}
      <motion.div
        className="absolute top-8 left-8 flex -space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6 }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className={`w-6 h-6 rounded-full border-2 border-testimonial-background overflow-hidden transition-all duration-300 ${
              i === activeIndex ? "ring-1 ring-testimonial-accent ring-offset-1 ring-offset-testimonial-background" : "grayscale opacity-50"
            }`}
            whileHover={{ scale: 1.1, opacity: 1 }}
          >
            {t.photo ? (
              <img src={getPhotoUrl(t.photo)} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-gray-400 text-xs">👤</span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Main content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="text-xl md:text-2xl font-light leading-relaxed tracking-tight text-testimonial-foreground"
          >
            <SplitText text={currentTestimonial.content} />
          </motion.blockquote>
        </AnimatePresence>

        {/* Author with reveal line */}
        <motion.div className="mt-12 relative" layout>
          <div className="flex items-center gap-4">
            {/* Avatar container with all images stacked */}
            <div className="relative w-12 h-12">
              <motion.div
                className="absolute -inset-1.5 rounded-full border border-testimonial-accent/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {testimonials.map((t, i) => (
                <React.Fragment key={t.id}>
                  {t.photo ? (
                    <motion.img
                      src={getPhotoUrl(t.photo)}
                      alt={t.name}
                      className="absolute inset-0 w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-[filter] duration-500"
                      animate={{
                        opacity: i === activeIndex ? 1 : 0,
                        zIndex: i === activeIndex ? 1 : 0,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  ) : (
                    <motion.div
                      className="absolute inset-0 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"
                      animate={{
                        opacity: i === activeIndex ? 1 : 0,
                        zIndex: i === activeIndex ? 1 : 0,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <span className="text-gray-400 text-xl">👤</span>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Author info with accent line */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="relative pl-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-px bg-testimonial-accent"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originY: 0 }}
                />
                <span className="block text-sm font-medium text-testimonial-foreground tracking-wide">
                  {currentTestimonial.name}
                </span>
                <span className="block text-xs text-testimonial-muted mt-0.5 font-mono uppercase tracking-widest">
                  {currentTestimonial.country || "Traveler"}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Photo Gallery for current testimonial */}
        {Array.isArray(currentTestimonial.gallery_photos) && currentTestimonial.gallery_photos.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`gallery-${activeIndex}`}
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onMouseEnter={() => setIsHoveredOnGallery(true)}
              onMouseLeave={() => setIsHoveredOnGallery(false)}
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {currentTestimonial.gallery_photos.map((photoUrl, idx) => (
                  <motion.div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 group cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      openLightbox(idx)
                    }}
                  >
                    <img
                      src={getPhotoUrl(photoUrl)}
                      alt={`Memory ${idx + 1}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      loading="lazy"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Progress bar */}
        <div className="mt-16 h-px bg-testimonial-border relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-testimonial-accent"
            initial={{ width: "0%" }}
            animate={{ width: `${((activeIndex + 1) / testimonials.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Keyboard hint */}
      <motion.div
        className="absolute bottom-8 left-8 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.4 : 0.2 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-[10px] text-testimonial-muted uppercase tracking-widest font-mono">Click anywhere</span>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && currentTestimonial.gallery_photos && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            style={{ cursor: "none" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveredInLightboxArea(true)}
            onMouseLeave={() => setIsHoveredInLightboxArea(false)}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
              onClick={closeLightbox}
              aria-label="Close gallery"
            >
              <svg
                className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="text-white font-mono text-sm">
                {lightboxIndex + 1} / {currentTestimonial.gallery_photos.length}
              </span>
            </div>

            {/* Previous button */}
            {currentTestimonial.gallery_photos.length > 1 && (
              <button
                className="absolute left-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all duration-300 group"
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                aria-label="Previous image"
              >
                <svg
                  className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Image container */}
            <motion.div
              className="relative mx-auto cursor-pointer"
              style={{ maxWidth: "80vw", maxHeight: "75vh" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={closeLightbox}
              onMouseEnter={() => setIsHoveredOnLightbox(true)}
              onMouseLeave={() => setIsHoveredOnLightbox(false)}
            >
              <img
                src={getPhotoUrl(currentTestimonial.gallery_photos[lightboxIndex])}
                alt={`Gallery image ${lightboxIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Next button */}
            {currentTestimonial.gallery_photos.length > 1 && (
              <button
                className="absolute right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all duration-300 group"
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                aria-label="Next image"
              >
                <svg
                  className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
