'use client'

import { useEffect, useRef } from 'react'

export default function CinematicTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const gsapInitialized = useRef(false)

  useEffect(() => {
    if (gsapInitialized.current) return
    gsapInitialized.current = true

    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      
      gsap.registerPlugin(ScrollTrigger)
      const section = sectionRef.current
      const text = textRef.current

      if (!section || !text) return

      // Create a timeline for coordinated animations
      const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=100%', // Animation completes after scrolling one viewport height
        scrub: 1.2, // Smooth scrubbing with slight delay for cinematic feel
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    })

      // Background color transition: white → black
      tl.to(section, {
      backgroundColor: '#000000',
      ease: 'none',
      duration: 1,
    }, 0)

      // Text animations (parallel)
      tl.to(text, {
      scale: 1.15,
      color: '#ffffff',
      ease: 'power1.inOut',
      duration: 1,
    }, 0)

    }

    initAnimations()

    // Cleanup
    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center"
      style={{
        height: '100vh',
        backgroundColor: '#ffffff',
      }}
    >
      <h2
        ref={textRef}
        className="text-center px-8 md:px-12"
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 'bold',
          fontSize: 'clamp(2rem, 5vw, 4.5rem)',
          color: '#9a9a9a',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
        }}
      >
        FOR THOSE
        <br />
        WHO TRAVEL
        <br />
        DIFFERENTLY
      </h2>
    </section>
  )
}
