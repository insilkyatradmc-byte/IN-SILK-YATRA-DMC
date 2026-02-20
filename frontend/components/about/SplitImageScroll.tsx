'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface SplitImageScrollProps {
  src: string
  alt: string
}

export default function SplitImageScroll({ src, alt }: SplitImageScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !leftRef.current || !rightRef.current) return

    const container = containerRef.current
    const left = leftRef.current
    const right = rightRef.current

    const ctx = gsap.context(() => {
      // Initial fade in
      gsap.fromTo(
        container,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      )

      // Split effect when reaching top
      const splitTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: true,
        },
      })

      splitTimeline
        .to(left, { x: '-50%', duration: 1, ease: 'power2.inOut' }, 0)
        .to(right, { x: '50%', duration: 1, ease: 'power2.inOut' }, 0)
        .to(container, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.5)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 flex">
        <div ref={leftRef} className="relative w-1/2 h-full overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-left"
            style={{ clipPath: 'inset(0 0 0 0)' }}
            priority
          />
        </div>
        <div ref={rightRef} className="relative w-1/2 h-full overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-right"
            style={{ clipPath: 'inset(0 0 0 0)' }}
            priority
          />
        </div>
      </div>
    </div>
  )
}
