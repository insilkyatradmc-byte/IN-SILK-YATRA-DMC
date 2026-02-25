'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MarqueeWithImageProps {
  text: string
  imageSrc: string
  imageAlt: string
  speed?: number
}

export default function MarqueeWithImage({ text, imageSrc, imageAlt, speed = 50 }: MarqueeWithImageProps) {
  const marqueeText = `${text} • ${text} • ${text} • ${text} • ${text} • `
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomComplete, setZoomComplete] = useState(false)
  const scrollAccumulatorRef = useRef(0)
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      
      // Check if section is at top of viewport
      if (rect.top <= 0 && !zoomComplete) {
        // Prevent default scrolling during zoom
        e.preventDefault()
        e.stopPropagation()
        
        setIsInView(true)
        
        // Only zoom on downward scroll
        if (e.deltaY > 0) {
          // Accumulate scroll for zoom
          scrollAccumulatorRef.current += e.deltaY
          
          const maxScroll = 1200 // Total scroll needed for full zoom
          const progress = Math.min(scrollAccumulatorRef.current / maxScroll, 1)
          
          // Scale from 0.5 to 2.8 (fills screen)
          const newScale = 0.5 + (progress * 2.3)
          setScale(newScale)
          setIsZooming(progress > 0 && progress < 1)
          
          // Complete zoom when fully scaled
          if (progress >= 1) {
            setZoomComplete(true)
            setIsZooming(false)
            // Small delay then allow normal scrolling
            setTimeout(() => {
              window.scrollBy({ top: 100, behavior: 'smooth' })
            }, 300)
          }
        }
      }
    }
    
    // Listen to scroll to detect when section comes into view
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      
      // Reset if scrolled back up above section
      if (rect.top > 100) {
        setScale(0.5)
        setZoomComplete(false)
        setIsZooming(false)
        setIsInView(false)
        scrollAccumulatorRef.current = 0
      }
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [zoomComplete])

  // Calculate text opacity based on zoom level
  const textOpacity = Math.max(0, 1 - (scale - 0.5) / 2.3 * 1.5)

  return (
    <div 
      ref={containerRef} 
      className="relative bg-[#e8e6e1]"
      style={{ height: zoomComplete ? '100vh' : '100vh' }}
    >
      {/* Fixed container during zoom, normal after */}
      <div 
        className={`${zoomComplete ? 'relative' : 'fixed'} top-0 left-0 right-0 h-screen flex items-center justify-center overflow-hidden bg-[#e8e6e1]`}
        style={{ 
          zIndex: zoomComplete ? 'auto' : 50
        }}
      >
        {/* Pure CSS marquee in background */}
        <style>{`
          @keyframes marquee-infinite {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
        <div 
          className="absolute inset-0 flex items-center overflow-hidden pointer-events-none z-0"
          style={{ opacity: textOpacity }}
        >
          <div
            className="whitespace-nowrap"
            style={{ animation: `marquee-infinite ${speed}s linear infinite` }}
          >
            <span className="inline-block text-[15vw] font-serif text-[#1c1917] opacity-25 tracking-[0.1em] uppercase select-none">
              {marqueeText}
            </span>
            <span className="inline-block text-[15vw] font-serif text-[#1c1917] opacity-25 tracking-[0.1em] uppercase select-none">
              {marqueeText}
            </span>
          </div>
        </div>

        {/* Image that zooms in place - stays centered */}
        <div className="relative z-10 flex justify-center items-center w-full h-full">
          <motion.div 
            className="relative w-[280px] md:w-[400px] aspect-[3/4] origin-center"
            animate={{ scale }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover shadow-2xl"
              loading="eager"
            />
          </motion.div>
        </div>
        
        {/* Scroll indicator - shows when zooming */}
        {isZooming && scale < 2.5 && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="text-[#1c1917] opacity-60 text-sm font-light tracking-wider">
                SCROLL TO EXPLORE
              </div>
              <div className="w-[1px] h-8 bg-[#1c1917] opacity-40 animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}