'use client'

import { useEffect, useRef, useState } from 'react'

export default function DetailedExperience() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)
  const smallImageRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const gsapInitialized = useRef(false)

  useEffect(() => {
    if (gsapInitialized.current) return
    gsapInitialized.current = true

    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      const textBlock = textBlockRef.current
      const mainImage = mainImageRef.current
      const smallImage = smallImageRef.current

      if (!section || !textBlock || !mainImage || !smallImage) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      })

      // Text block fade + slide
      tl.fromTo(
        textBlock,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        }
      )

      // Main image mask reveal
      tl.fromTo(
        mainImage,
        {
          y: '15%',
          scale: 1.08,
        },
        {
          y: '0%',
          scale: 1,
          duration: 1.2,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        },
        '-=0.6'
      )

      // Small image reveal
      tl.fromTo(
        smallImage,
        {
          y: '20%',
          scale: 1.08,
          opacity: 0,
        },
        {
          y: '0%',
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        },
        '-=0.8'
      )
    }

    initAnimations()

    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      })
    }
  }, [])

  const handleArrowHover = async (isEnter: boolean) => {
    const { gsap } = await import('gsap')
    if (!arrowRef.current) return
    
    gsap.to(arrowRef.current, {
      x: isEnter ? 6 : 0,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  return (
    <section
      ref={sectionRef}
      className="bg-black py-20 md:py-32 lg:py-40"
    >
      <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Text Content */}
          <div className="space-y-8 md:space-y-12">
            <div
              ref={textBlockRef}
              style={{ opacity: 0 }}
            >
              {/* Title */}
              <h3
                className="mb-6 md:mb-8"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  lineHeight: '1.15',
                  fontWeight: '400',
                  letterSpacing: '-0.01em',
                  color: '#ffffff',
                }}
              >
                CHANIA LUXURY
                <br />
                JEEP EXPEDITIONS
              </h3>

              {/* Paragraph */}
              <p
                className="mb-8 md:mb-10 leading-relaxed max-w-xl"
                style={{
                  fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                  color: '#aaa',
                }}
              >
                Off-road is redefined through IN-SILK YATRA's lens — an elevated exploration
                of Chania's raw landscapes. Think wild beaches, rugged mountain passes,
                olive groves, and vineyards unfolding in one seamless narrative. Between
                tastings of wine and oil, our expert drivers navigate terrain with
                precision, revealing the island's wild heart with quiet mastery and style.
              </p>

              {/* Arrow Link */}
              <div
                className="inline-flex items-center gap-3 cursor-pointer group"
                onMouseEnter={() => handleArrowHover(true)}
                onMouseLeave={() => handleArrowHover(false)}
              >
                <span
                  className="text-white text-sm uppercase tracking-wider"
                  style={{ letterSpacing: '0.15em' }}
                >
                  DISCOVER MORE
                </span>
                <div ref={arrowRef}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Small Vertical Image */}
            <div className="relative h-[300px] md:h-[400px] overflow-hidden mt-12">
              <div
                ref={smallImageRef}
                className="w-full h-full"
                style={{ willChange: 'transform, opacity' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=800&fit=crop"
                  alt="Adventure Detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Large Image */}
          <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
            <div
              ref={mainImageRef}
              className="w-full h-full"
              style={{ willChange: 'transform' }}
            >
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=1600&fit=crop"
                alt="Luxury Jeep Experience"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
