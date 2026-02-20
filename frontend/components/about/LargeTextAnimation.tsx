'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LargeTextAnimationProps {
  text: string
  direction: 'left' | 'right'
  delay?: number
}

export default function LargeTextAnimation({ text, direction, delay = 0 }: LargeTextAnimationProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { x: direction === 'left' ? -200 : 200, opacity: 0 },
        {
          x: 0,
          opacity: 0.3,
          duration: 1.5,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, textRef)

    return () => ctx.revert()
  }, [direction, delay])

  return (
    <div
      ref={textRef}
      className={`text-[15vw] md:text-[12vw] font-light tracking-wider text-white select-none ${
        direction === 'right' ? 'text-right' : 'text-left'
      }`}
      style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        letterSpacing: '0.05em'
      }}
    >
      {text}
    </div>
  )
}
