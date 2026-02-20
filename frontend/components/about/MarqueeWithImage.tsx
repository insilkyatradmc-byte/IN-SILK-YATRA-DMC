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
  const stickyRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !marqueeRef.current || !contentRef.current) return

    const marquee = marqueeRef.current
    const content = contentRef.current
    const container = containerRef.current
    const image = imageRef.current

    // Build clones so the marquee has enough text to loop
    const contentWidth = content.scrollWidth
    const clonesAdded: HTMLDivElement[] = []
    for (let i = 0; i < 3; i++) {
      const clone = content.cloneNode(true) as HTMLDivElement
      marquee.appendChild(clone)
      clonesAdded.push(clone)
    }

    // Defer to rAF so GSAP initialises after the browser paints — prevents
    // ScrollTrigger from snapping to end state on Next.js client-side navigation.
    let ctx: gsap.Context
    const rafId = requestAnimationFrame(() => {
    ctx = gsap.context(() => {
      // Seamless marquee
      gsap.to(marquee, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % contentWidth) },
      })

      // Image rises into view as user scrolls through the 200vh container.
      // Trigger is the CONTAINER, image animates inside the sticky wrapper.
      gsap.fromTo(
        image,
        { yPercent: 60, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'center top',
            scrub: 1,
          },
        }
      )
    }, containerRef)

    }) // end rAF

    return () => {
      cancelAnimationFrame(rafId)
      ctx?.revert()
      clonesAdded.forEach(c => c.remove())
    }
  }, [speed])

  return (
    // overflow-hidden prevents the sticky content from bleeding outside the component
    <div ref={containerRef} className="relative h-[200vh] bg-[#e8e6e1] overflow-hidden">
      {/* Sticky wrapper — stays at the top of the viewport while scrolling through 200vh */}
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden flex items-center bg-[#e8e6e1]">
        {/* Scrolling marquee text — contained inside sticky, not fixed */}
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
          <div className="overflow-hidden whitespace-nowrap w-full">
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

        {/* Image animates up within the sticky section */}
        <div
          ref={imageRef}
          className="relative z-10 w-full flex justify-center px-8 pointer-events-none"
        >
          <div className="relative w-full max-w-[250px] md:max-w-md aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
