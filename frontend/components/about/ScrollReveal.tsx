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

    const element = elementRef.current

    // Initial state
    const initialState: any = { opacity: 0 }
    switch (direction) {
      case 'up':
        initialState.y = 100
        break
      case 'down':
        initialState.y = -100
        break
      case 'left':
        initialState.x = 100
        break
      case 'right':
        initialState.x = -100
        break
    }

    gsap.set(element, initialState)

    // Animate on scroll
    const animation = gsap.to(element, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play none none none',
      },
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [direction, delay])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}
