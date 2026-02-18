'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ScrollingMarqueeProps {
  text: string
  speed?: number
}

export default function ScrollingMarquee({ text, speed = 100 }: ScrollingMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marqueeRef.current || !contentRef.current) return

    const marquee = marqueeRef.current
    const content = contentRef.current
    const contentWidth = content.offsetWidth

    // Clone the content multiple times to ensure seamless loop
    const clone = content.cloneNode(true) as HTMLDivElement
    marquee.appendChild(clone)

    // Animate
    const tl = gsap.timeline({ repeat: -1 })
    tl.to([content, clone], {
      x: -contentWidth,
      duration: speed,
      ease: 'none',
    }).set([content, clone], { x: 0 })

    return () => {
      tl.kill()
    }
  }, [speed])

  return (
    <div className="overflow-hidden whitespace-nowrap bg-[#e8e0d5]">
      <div ref={marqueeRef} className="inline-flex">
        <div ref={contentRef} className="inline-flex items-center px-4">
          <span className="text-[8vw] md:text-[6vw] font-light tracking-wider text-gray-400 uppercase">
            {text}
          </span>
          <span className="mx-8 text-[8vw] md:text-[6vw] font-light text-gray-400">•</span>
          <span className="text-[8vw] md:text-[6vw] font-light tracking-wider text-gray-400 uppercase">
            {text}
          </span>
          <span className="mx-8 text-[8vw] md:text-[6vw] font-light text-gray-400">•</span>
        </div>
      </div>
    </div>
  )
}
