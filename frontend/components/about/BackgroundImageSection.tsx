'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface BackgroundImageSectionProps {
  src: string
  alt: string
  title: string
  subtitle?: string
  paragraphs: string[]
}

export default function BackgroundImageSection({ src, alt, title, subtitle, paragraphs }: BackgroundImageSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const elements = [titleRef.current, subtitleRef.current, contentRef.current].filter(Boolean)

    elements.forEach((element, index) => {
      if (element) {
        gsap.fromTo(
          element,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: index * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center py-20 px-8 overflow-hidden bg-black">
      {/* Background Image - Smaller and Darker */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-3/4 h-3/4 relative">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h2 ref={titleRef} className="text-[6vw] md:text-[4.5vw] font-serif font-light leading-tight tracking-wide mb-8">
          {title}
        </h2>
        
        {subtitle && (
          <p ref={subtitleRef} className="text-xl md:text-2xl font-light mb-12 opacity-90">
            {subtitle}
          </p>
        )}
        
        <div ref={contentRef} className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base md:text-lg leading-relaxed opacity-80 max-w-3xl mx-auto">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
