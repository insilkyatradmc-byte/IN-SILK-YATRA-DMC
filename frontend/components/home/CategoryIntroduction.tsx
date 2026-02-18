'use client'

import { useEffect, useRef } from 'react'

export default function CategoryIntroduction() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const topImageRef = useRef<HTMLDivElement>(null)
  const bottomImageRef = useRef<HTMLDivElement>(null)
  const contentBlockRef = useRef<HTMLDivElement>(null)
  const contentTitleRef = useRef<HTMLHeadingElement>(null)
  const contentTextRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const gsapInitialized = useRef(false)

  useEffect(() => {
    if (gsapInitialized.current) return
    gsapInitialized.current = true

    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      
      gsap.registerPlugin(ScrollTrigger)

      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      const label = labelRef.current
      const heading = headingRef.current
      const topImage = topImageRef.current
      const bottomImage = bottomImageRef.current
      const contentBlock = contentBlockRef.current
      const contentTitle = contentTitleRef.current
      const contentText = contentTextRef.current

      if (!section || !label || !heading || !topImage || !bottomImage || !contentBlock || !contentTitle || !contentText) return

      const lines = heading.querySelectorAll('.line')
      const textElements = contentText.querySelectorAll('.text-reveal')

      // First section animations
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      })

      // Label animation
      tl1.fromTo(
        label,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )

      // Heading lines reveal
      tl1.fromTo(
        lines,
        { yPercent: 120 },
        { yPercent: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out' },
        '-=0.3'
      )

      // Top image reveal (from top to bottom - reverse effect)
      tl1.fromTo(
        topImage,
        { y: '-15%', scale: 1.05 },
        { y: '0%', scale: 1, duration: 1.2, ease: 'cubic-bezier(0.19, 1, 0.22, 1)' },
        '-=0.85'
      )

      // Second section animations
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: bottomImage,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      // Bottom image reveal (from bottom to top)
      tl2.fromTo(
        bottomImage,
        { y: '20%', scale: 1.06, opacity: 0 },
        { y: '0%', scale: 1, opacity: 1, duration: 1.2, ease: 'cubic-bezier(0.19, 1, 0.22, 1)' }
      )

      // Content block container fade in
      tl2.set(contentBlock, { opacity: 1 }, '-=1.2')

      // Title reveal from bottom
      tl2.fromTo(
        contentTitle,
        { yPercent: 120 },
        { yPercent: 0, duration: 1, ease: 'power3.out' },
        '-=0.8'
      )

      // Paragraphs reveal from bottom with stagger
      tl2.fromTo(
        textElements,
        { yPercent: 120 },
        { yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
        '-=0.7'
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
    <section ref={sectionRef} className="bg-white">
      {/* First Section: Label + Heading + Top Image */}
      <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 py-20 md:py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 md:space-y-12">
            {/* Label */}
            <div ref={labelRef} style={{ opacity: 0 }}>
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{ color: '#666' }}
              >
                CURATED COLLECTION
              </span>
            </div>

            {/* Heading */}
            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  lineHeight: '1.1',
                  fontWeight: '400',
                  letterSpacing: '-0.02em',
                  color: '#1a1a1a',
                }}
              >
                <div className="overflow-hidden">
                  <div className="line">LUXURY HOTELS</div>
                </div>
                <div className="overflow-hidden">
                  <div className="line">& VILLAS</div>
                </div>
              </h2>
            </div>
          </div>

          {/* Right: Large Top Image */}
          <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
            <div
              ref={topImageRef}
              className="w-full h-full"
              style={{ willChange: 'transform' }}
            >
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=1600&fit=crop"
                alt="Luxury Villa Pool"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Section: Bottom Image + Content Block */}
      <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16 pb-20 md:pb-32 lg:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Bottom Image */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            <div
              ref={bottomImageRef}
              className="w-full h-full"
              style={{ willChange: 'transform, opacity' }}
            >
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&h=1200&fit=crop"
                alt="Boutique Hotel Architecture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Content Block */}
          <div
            ref={contentBlockRef}
            className="space-y-6 md:space-y-8"
            style={{ opacity: 0 }}
          >
            {/* Title */}
            <div className="overflow-hidden">
              <h3
                ref={contentTitleRef}
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  lineHeight: '1.2',
                  fontWeight: '400',
                  letterSpacing: '-0.01em',
                  color: '#1a1a1a',
                }}
              >
                Boutique Silk Road Hotels
              </h3>
            </div>

            {/* Description */}
            <div ref={contentTextRef} className="space-y-4 max-w-xl">
              <div className="overflow-hidden">
                <p
                  className="text-reveal"
                  style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                    lineHeight: '1.7',
                    color: '#4a4a4a',
                  }}
                >
                  Because intimacy always leaves the deepest mark.
                </p>
              </div>
              <div className="overflow-hidden">
                <p
                  className="text-reveal"
                  style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                    lineHeight: '1.7',
                    color: '#4a4a4a',
                  }}
                >
                  Here, ancient traditions meet modern comfort and silence becomes 
                  the new indulgence. These boutique retreats trade scale for soul — 
                  fewer rooms, deeper connections. Beauty that doesn't demand attention; 
                  it earns it through the stories woven into every corner of the Silk Road.
                </p>
              </div>
            </div>

            {/* Arrow Link */}
            <div
              className="inline-flex items-center gap-3 cursor-pointer group pt-4"
              onMouseEnter={() => handleArrowHover(true)}
              onMouseLeave={() => handleArrowHover(false)}
            >
              <div ref={arrowRef}>
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                  <path
                    d="M0 12H38M38 12L26 0M38 12L26 24"
                    stroke="#1a1a1a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
