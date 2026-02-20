'use client'

import { motion } from 'framer-motion'

interface BackgroundImageSectionProps {
  src: string
  alt: string
  title: string
  subtitle?: string
  paragraphs: string[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.2 },
  }),
}

export default function BackgroundImageSection({ src, alt, title, subtitle, paragraphs }: BackgroundImageSectionProps) {

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-20 px-8 overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-3/4 h-3/4 relative">
          <img src={src} alt={alt} className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <motion.h2
          className="text-[6vw] md:text-[4.5vw] font-serif font-light leading-tight tracking-wide mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          custom={0}
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            className="text-xl md:text-2xl font-light mb-12 opacity-90"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            custom={1}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          className="space-y-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          custom={2}
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base md:text-lg leading-relaxed opacity-80 max-w-3xl mx-auto">
              {paragraph}
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
