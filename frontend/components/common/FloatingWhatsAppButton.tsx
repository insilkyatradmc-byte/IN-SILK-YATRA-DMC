'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function FloatingWhatsAppButton() {
  const whatsappNumber = '916354034645' // Company WhatsApp number
  const whatsappMessage = 'Hello! I would like to know more about your Silk Road tours.'

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, '_blank')
  }

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg overflow-hidden bg-[#25D366] hover:bg-[#20BA5A] hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <Image
        src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1771571159/whatsapp-logo_578229-240_vfmgpy.avif"
        alt="WhatsApp"
        width={56}
        height={56}
        className="w-full h-full object-cover"
        priority
      />
    </motion.button>
  )
}
