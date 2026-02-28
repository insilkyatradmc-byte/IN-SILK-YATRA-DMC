'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface SplitImageWithOverlayProps {
  leftSrc: string
  rightSrc: string
  alt: string
}

export default function SplitImageWithOverlay({ leftSrc, rightSrc, alt }: SplitImageWithOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Timeline (160vh total) for smooth animation ────────────────────
  // Scroll 0   : image fully visible, "A SHARED STORY" overlay visible
  // 0.00–0.72  : doors slide open immediately — pure horizontal, no Y
  // 0.60–0.80  : panels fade out as doors finish opening
  // 0.78–1.00  : background transitions to light

  // Image starts fully visible — no fade-in wait
  const imageOpacity = useTransform(scrollYProgress, [0.60, 0.80], [1, 0])

  // Doors open from the very first scroll pixel
  const leftX  = useTransform(scrollYProgress, [0, 0.72], ['0%', '-100%'])
  const rightX = useTransform(scrollYProgress, [0, 0.72], ['0%',  '100%'])

  // Counter-translate so image stays visually stationary while door slides
  const leftImgX  = useTransform(scrollYProgress, [0, 0.72], ['0%',  '100%'])
  const rightImgX = useTransform(scrollYProgress, [0, 0.72], ['0%', '-100%'])

  // "A SHARED STORY" fades out as split progresses
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.30, 0.55], [1, 1, 0])

  return (
    <div ref={containerRef} className="relative h-[120vh] bg-black">
      <motion.div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* Door panels - Both mobile and desktop */}
        <motion.div className="absolute inset-0 flex" style={{ opacity: imageOpacity }}>
          <motion.div className="relative w-1/2 h-full overflow-hidden" style={{ x: leftX }}>
            <motion.img
              src={leftSrc} alt={alt}
              className="absolute inset-0 w-full h-full object-cover object-right"
              style={{ x: leftImgX }}
            />
          </motion.div>
          <motion.div className="relative w-1/2 h-full overflow-hidden" style={{ x: rightX }}>
            <motion.img
              src={rightSrc} alt={alt}
              className="absolute inset-0 w-full h-full object-cover object-left"
              style={{ x: rightImgX }}
            />
          </motion.div>
        </motion.div>

        {/* "A SHARED STORY" overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-start px-8 md:px-20 pointer-events-none z-10"
          style={{ opacity: overlayOpacity }}
        >
          <h2 className="text-white text-[10vw] md:text-[7vw] font-light leading-tight tracking-wide">
            A SHARED<br />STORY
          </h2>
        </motion.div>

      </motion.div>
    </div>
  )
}
