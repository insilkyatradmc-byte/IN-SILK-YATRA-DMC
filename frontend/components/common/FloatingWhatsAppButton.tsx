'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function FloatingWhatsAppButton() {
  const whatsappNumber = '77074227482' // Kazakhstan WhatsApp number
  const whatsappMessage = 'Hello! I would like to know more about your Silk Road tours.'

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, '_blank')
  }

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full shadow-2xl overflow-hidden bg-black hover:shadow-[0_0_25px_rgba(201,184,150,0.6)] transition-all duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <Image
        src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770897235/WhatsApp_Logo_yjoo7u.avif"
        alt="WhatsApp"
        width={64}
        height={64}
        className="w-full h-full object-cover mix-blend-lighten"
        style={{ backgroundColor: '#000' }}
        priority
      />
    </motion.button>
  )
}
