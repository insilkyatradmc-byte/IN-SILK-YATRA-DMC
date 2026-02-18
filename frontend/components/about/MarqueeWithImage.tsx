'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface MarqueeWithImageProps {
  text: string
  imageSrc: string
  imageAlt: string
  speed?: number
}

export default function MarqueeWithImage({ text, imageSrc, imageAlt, speed = 50 }: MarqueeWithImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !marqueeRef.current || !contentRef.current) return

    const container = containerRef.current
    const image = imageRef.current
    const marquee = marqueeRef.current
    const content = contentRef.current

    // Marquee animation - seamless loop
    const contentWidth = content.offsetWidth
    
    // Create multiple clones for seamless effect
    const clone1 = content.cloneNode(true) as HTMLDivElement
    const clone2 = content.cloneNode(true) as HTMLDivElement
    marquee.appendChild(clone1)
    marquee.appendChild(clone2)

    // Seamless infinite scroll
    gsap.to(marquee, {
      x: -contentWidth,
      duration: speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % contentWidth),
      },
    })

    // Image scroll animation
    gsap.fromTo(
      image,
      { y: '100vh', opacity: 0 },
      {
        y: '0vh',
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom center',
          scrub: 1,
          pin: true,
        },
      }
    )

    return () => {
      gsap.killTweensOf(marquee)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [speed])

  return (
    <div ref={containerRef} className="relative h-[200vh] bg-[#e8e6e1]">
      {/* Fixed Marquee Background */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ marginTop: '-10vh' }}>
        <div className="overflow-hidden whitespace-nowrap w-full bg-[#e8e6e1]">
          <div ref={marqueeRef} className="inline-flex">
            <div ref={contentRef} className="inline-flex items-center px-4">
              <span className="text-[15vw] font-serif text-gray-500 opacity-50 tracking-[0.1em] uppercase select-none">
                {text}
              </span>
              <span className="mx-6 text-[15vw] font-serif text-gray-500 opacity-50">•</span>
              <span className="text-[15vw] font-serif text-gray-500 opacity-50 tracking-[0.1em] uppercase select-none">
                {text}
              </span>
              <span className="mx-6 text-[15vw] font-serif text-gray-500 opacity-50">•</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image that animates up on scroll */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div ref={imageRef} className="w-full flex justify-center px-8">
          <div className="relative w-full max-w-[250px] md:max-w-md aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
