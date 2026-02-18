'use client'

import { useEffect, useRef } from 'react'

export default function CategoryFeature() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)
  const gsapInitialized = useRef(false)

  useEffect(() => {
    if (gsapInitialized.current) return
    gsapInitialized.current = true

    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      const title = titleRef.current
      const imagesContainer = imagesRef.current

      if (!section || !title || !imagesContainer) return

      const images = imagesContainer.querySelectorAll('.floating-image')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      })

      // Title fade + slide
      tl.fromTo(
        title,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
        }
      )

      // Images reveal with stagger
      tl.fromTo(
        images,
        {
          y: 60,
          scale: 1.06,
          opacity: 0,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        },
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

  return (
    <section
      ref={sectionRef}
      className="bg-black py-20 md:py-32 lg:py-40"
    >
      <div className="max-w-[1800px] mx-auto px-8 md:px-12 lg:px-16">
        {/* Title */}
        <h2
          ref={titleRef}
          className="text-center mb-16 md:mb-24 lg:mb-32"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            lineHeight: '1.2',
            fontWeight: '400',
            letterSpacing: '-0.01em',
            color: '#d4c5a9',
            opacity: 0,
          }}
        >
          Day Tours & Luxury Experiences
        </h2>

        {/* Floating Images Grid */}
        <div ref={imagesRef} className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Image */}
            <div className="floating-image group relative h-[400px] md:h-[500px] overflow-hidden cursor-pointer">
              <div className="w-full h-full transition-transform duration-700 group-hover:scale-103">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1000&fit=crop"
                  alt="Luxury Hotel"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Image */}
            <div className="floating-image group relative h-[400px] md:h-[500px] overflow-hidden cursor-pointer lg:mt-16">
              <div className="w-full h-full transition-transform duration-700 group-hover:scale-103">
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=1000&fit=crop"
                  alt="Beach Resort"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Bottom Image */}
            <div className="floating-image group relative h-[400px] md:h-[500px] overflow-hidden cursor-pointer md:col-span-2 lg:col-span-1">
              <div className="w-full h-full transition-transform duration-700 group-hover:scale-103">
                <img
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=1000&fit=crop"
                  alt="Villa Pool"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
