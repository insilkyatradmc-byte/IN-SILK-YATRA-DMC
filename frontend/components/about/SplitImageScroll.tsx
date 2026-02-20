'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface SplitImageScrollProps {
  src: string
  alt: string
}

export default function SplitImageScroll({ src, alt }: SplitImageScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const wrapperOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7, 0.9], [0, 1, 1, 0])
  const wrapperY = useTransform(scrollYProgress, [0, 0.15], ['8%', '0%'])
  const wrapperScale = useTransform(scrollYProgress, [0.65, 0.9], [1, 0.82])
  const leftX = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '-50%'])
  const rightX = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '50%'])

  return (
    <div ref={containerRef} className="relative h-[300vh] overflow-hidden">
      <motion.div
        className="sticky top-0 h-screen w-full"
        style={{ opacity: wrapperOpacity, y: wrapperY, scale: wrapperScale }}
      >
        <div className="absolute inset-0 flex">
          <motion.div className="relative w-1/2 h-full overflow-hidden" style={{ x: leftX }}>
            <Image src={src} alt={alt} fill className="object-cover object-left" priority />
          </motion.div>
          <motion.div className="relative w-1/2 h-full overflow-hidden" style={{ x: rightX }}>
            <Image src={src} alt={alt} fill className="object-cover object-right" priority />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
