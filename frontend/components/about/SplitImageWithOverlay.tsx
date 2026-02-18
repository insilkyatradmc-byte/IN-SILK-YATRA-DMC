'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SplitImageWithOverlayProps {
  leftSrc: string
  rightSrc: string
  alt: string
}

export default function SplitImageWithOverlay({ leftSrc, rightSrc, alt }: SplitImageWithOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const overlayTextRef = useRef<HTMLDivElement>(null)
  const hiddenTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !imageWrapperRef.current || !leftRef.current || !rightRef.current || !overlayTextRef.current || !hiddenTextRef.current) return

    const container = containerRef.current
    const imageWrapper = imageWrapperRef.current
    const left = leftRef.current
    const right = rightRef.current
    const overlayText = overlayTextRef.current
    const hiddenText = hiddenTextRef.current

    // Initial fade in from bottom
    gsap.fromTo(
      imageWrapper,
      { opacity: 0, y: 150 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    )

    // Main timeline for split, shrink and text animations
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true,
      },
    })

    // Overlay text scrolls slightly
    mainTimeline.to(overlayText, {
      y: -50,
      opacity: 0.8,
      duration: 0.3,
      ease: 'none',
    }, 0)

    // Split effect
    mainTimeline.to(left, {
      x: '-50%',
      duration: 0.4,
      ease: 'power2.inOut',
    }, 0.3)
    
    mainTimeline.to(right, {
      x: '50%',
      duration: 0.4,
      ease: 'power2.inOut',
    }, 0.3)

    // Shrink and fade image
    mainTimeline.to(imageWrapper, {
      scale: 0.7,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 0.5)

    // Fade out overlay text completely
    mainTimeline.to(overlayText, {
      opacity: 0,
      duration: 0.2,
    }, 0.6)

    // Reveal hidden text from behind (it was behind the image)
    mainTimeline.fromTo(hiddenText, {
      opacity: 0,
      y: 100,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
    }, 0.7)

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-black">
      {/* Image Wrapper - splits and shrinks */}
      <div ref={imageWrapperRef} className="absolute inset-0 flex">
        <div ref={leftRef} className="relative w-1/2 h-full overflow-hidden">
          <img
            src={leftSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
        </div>
        <div ref={rightRef} className="relative w-1/2 h-full overflow-hidden">
          <img
            src={rightSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
        </div>
      </div>

      {/* Overlay Text - on top of image */}
      <div ref={overlayTextRef} className="absolute inset-0 flex items-center justify-start px-12 md:px-20 pointer-events-none z-10">
        <h2 className="text-white text-[8vw] md:text-[7vw] font-light leading-tight tracking-wide">
          A SHARED<br />STORY
        </h2>
      </div>

      {/* Hidden Text - behind image, revealed when image shrinks */}
      <div ref={hiddenTextRef} className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center pointer-events-none z-0">
        <h2 className="text-white text-[5vw] md:text-[4vw] font-light leading-tight tracking-wide mb-8">
          A STORY PASSED<br />FROM ONE GENERATION<br />TO THE NEXT
        </h2>
        <p className="text-white text-lg md:text-xl max-w-2xl opacity-80">
          This is where the story begins — and where it continues to breathe.
        </p>
      </div>
    </div>
  )
}
