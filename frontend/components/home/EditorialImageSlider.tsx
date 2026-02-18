'use client'

import { useState, useEffect, useRef } from 'react'

interface Slide {
  id: number
  subtitle: string
  heading: string
  image: string
}

interface EditorialSliderProps {
  slides: Slide[]
  variant?: 'default' | 'statement' | 'philosophy'
  onSlideChange?: (index: number) => void
}

export default function EditorialImageSlider({ 
  slides, 
  variant = 'default',
  onSlideChange 
}: EditorialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const goToNext = () => {
    if (isAnimating) return
    const newIndex = (currentIndex + 1) % slides.length
    setCurrentIndex(newIndex)
    onSlideChange?.(newIndex)
  }

  const goToPrev = () => {
    if (isAnimating) return
    const newIndex = (currentIndex - 1 + slides.length) % slides.length
    setCurrentIndex(newIndex)
    onSlideChange?.(newIndex)
  }

  useEffect(() => {
    const animateSlide = async () => {
      const { gsap } = await import('gsap')
      
      const container = containerRef.current
      const textContainer = textRef.current
      
      if (!container || !textContainer) return

      setIsAnimating(true)

      const currentBg = container.querySelector(`[data-bg="${currentIndex}"]`)
      const allBgs = container.querySelectorAll('[data-bg]')
      const subtitle = textContainer.querySelector('.subtitle')
      const headingLines = textContainer.querySelectorAll('.heading-line')

      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      })

      // Hide all backgrounds except current
      allBgs.forEach((bg, idx) => {
        if (idx !== currentIndex) {
          gsap.set(bg, { display: 'none' })
        } else {
          gsap.set(bg, { display: 'block' })
        }
      })

      // Image entrance: scale + fade
      if (currentBg) {
        tl.fromTo(
          currentBg,
          {
            scale: 1.08,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
          },
          0
        )
      }

      // Subtitle fade in
      if (subtitle) {
        tl.fromTo(
          subtitle,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 0.7,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          0.2
        )
      }

      // Heading line-by-line reveal
      if (headingLines.length > 0) {
        tl.fromTo(
          headingLines,
          {
            yPercent: 120,
          },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0.3
        )
      }
    }

    animateSlide()
  }, [currentIndex])

  const overlayOpacity = variant === 'philosophy' ? 0.5 : 0.35

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            data-bg={idx}
            className="absolute inset-0 w-full h-full"
            style={{ 
              display: idx === currentIndex ? 'block' : 'none',
              willChange: 'transform, opacity'
            }}
          >
            <img
              src={slide.image}
              alt={slide.heading}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          </div>
        ))}
      </div>

      {/* Text Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-12">
        <div ref={textRef} className="text-center max-w-5xl">
          {/* Subtitle */}
          <div 
            className="subtitle mb-6 md:mb-8 font-handwritten"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              color: '#fff',
              opacity: 0,
            }}
          >
            {slides[currentIndex].subtitle}
          </div>

          {/* Heading */}
          <div className="overflow-hidden">
            <h1
              className="text-white"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                lineHeight: '1.1',
                fontWeight: '400',
                letterSpacing: '-0.02em',
              }}
            >
              {slides[currentIndex].heading.split('\n').map((line, idx) => (
                <div key={idx} className="overflow-hidden">
                  <div className="heading-line">{line}</div>
                </div>
              ))}
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        disabled={isAnimating}
        className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-all disabled:opacity-30"
        aria-label="Previous"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        disabled={isAnimating}
        className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-20 w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-all disabled:opacity-30"
        aria-label="Next"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  )
}
