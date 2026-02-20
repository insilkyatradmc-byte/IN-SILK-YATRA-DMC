'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const initialX = direction === 'left' ? 100 : direction === 'right' ? -100 : 0
    const initialY = direction === 'up' ? 100 : direction === 'down' ? -100 : 0

    // Defer GSAP setup to rAF so it runs AFTER the browser paints the page.
    // Without this, on Next.js client-side navigation ScrollTrigger calculates
    // positions before layout is final and snaps animations to their end state.
    let ctx: gsap.Context
    const rafId = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          elementRef.current,
          { opacity: 0, x: initialX, y: initialY },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay,
            scrollTrigger: {
              trigger: elementRef.current,
              start: 'top 88%',
              end: 'bottom 15%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }, elementRef)
    })

    return () => {
      cancelAnimationFrame(rafId)
      ctx?.revert()
    }
  }, [direction, delay])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}
