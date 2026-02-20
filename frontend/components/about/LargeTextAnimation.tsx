'use client'

import { motion } from 'framer-motion'

interface LargeTextAnimationProps {
  text: string
  direction: 'left' | 'right'
  delay?: number
}

export default function LargeTextAnimation({ text, direction, delay = 0 }: LargeTextAnimationProps) {
  return (
    <motion.div
      className={`text-[15vw] md:text-[12vw] font-light tracking-wider text-white select-none ${
        direction === 'right' ? 'text-right' : 'text-left'
      }`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}
      initial={{ x: direction === 'left' ? -200 : 200, opacity: 0 }}
      whileInView={{ x: 0, opacity: 0.3 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {text}
    </motion.div>
  )
}
