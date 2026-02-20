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

  // ── Timeline (160vh total) ────────────────────────────────────────
  // Scroll 0   : image fully visible, "A SHARED STORY" overlay visible
  // 0.00–0.72  : doors slide open immediately — pure horizontal, no Y
  // 0.60–0.80  : panels fade out as doors finish opening
  // 0.78–1.00  : hidden text rises in

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

  // Hidden text after doors open
  const hiddenTextOpacity = useTransform(scrollYProgress, [0.78, 1.0], [0, 1])
  const hiddenTextY       = useTransform(scrollYProgress, [0.78, 1.0], ['5%', '0%'])

  return (
    <div ref={containerRef} className="relative h-[160vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Door panels */}
        <motion.div className="absolute inset-0 flex" style={{ opacity: imageOpacity }}>
          <motion.div className="relative w-1/2 h-full overflow-hidden" style={{ x: leftX }}>
            <motion.img
              src={leftSrc} alt={alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ x: leftImgX }}
            />
          </motion.div>
          <motion.div className="relative w-1/2 h-full overflow-hidden" style={{ x: rightX }}>
            <motion.img
              src={rightSrc} alt={alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ x: rightImgX }}
            />
          </motion.div>
        </motion.div>

        {/* "A SHARED STORY" overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-start px-12 md:px-20 pointer-events-none z-10"
          style={{ opacity: overlayOpacity }}
        >
          <h2 className="text-white text-[8vw] md:text-[7vw] font-light leading-tight tracking-wide">
            A SHARED<br />STORY
          </h2>
        </motion.div>

        {/* Revealed text */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center pointer-events-none z-0"
          style={{ opacity: hiddenTextOpacity, y: hiddenTextY }}
        >
          <h2 className="text-white text-[5vw] md:text-[4vw] font-light leading-tight tracking-wide mb-8">
            A STORY PASSED<br />FROM ONE GENERATION<br />TO THE NEXT
          </h2>
          <p className="text-white text-lg md:text-xl max-w-2xl opacity-80">
            This is where the story begins — and where it continues to breathe.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
