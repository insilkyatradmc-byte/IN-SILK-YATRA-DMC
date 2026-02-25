'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

export default function FloatingEmailButton() {
  const email = 'insilkyatradmc@gmail.com'
  const subject = 'Tour Inquiry - IN-SILK YATRA DMC'
  const body = 'Hello! I would like to inquire about your tours in Kazakhstan and Central Asia.'

  const handleClick = () => {
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
  }

  return (
    <motion.button
      onClick={handleClick}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#c9b896] hover:bg-[#d4c5b0] text-black font-semibold shadow-2xl overflow-hidden transition-all duration-300 flex items-center justify-center group"
      style={{
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        padding: '24px 12px',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      }}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
      whileHover={{ x: -5 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Send Email"
    >
      <div className="flex items-center gap-3">
        <Mail size={20} className="rotate-90" />
        <span className="text-sm tracking-widest font-bold uppercase">
          Enquire Now
        </span>
      </div>
    </motion.button>
  )
}
