'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useShouldReduceMotion } from '@/lib/performance-hooks'
import Image from 'next/image'

export default function CEOSection() {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useShouldReduceMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })
  
  // Call hooks unconditionally
  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95])

  // Disable parallax on mobile for performance
  const imageY = shouldReduceMotion ? 0 : parallaxY
  const imageScale = shouldReduceMotion ? 1 : parallaxScale

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  }

  const specialtyVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.8 + i * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  }

  const specialties = [
    'Leisure & FIT Travel',
    'Corporate Travel Solutions',
    'MICE & Business Events',
    'Customized Group Programs',
    'B2B Travel Partnerships'
  ]

  return (
    <section ref={containerRef} className="relative bg-black py-20 px-4 sm:px-8 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#c9b896]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#c9b896]/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative max-w-7xl mx-auto"
      >
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Image with Premium Effects */}
          <motion.div variants={itemVariants} className="relative lg:order-1">
            <div className="relative group">
              {/* Decorative frame */}
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-br from-[#c9b896] via-[#c9b896]/50 to-transparent rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                animate={{
                  rotate: [0, 5, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Image container with glass effect */}
              <motion.div 
                className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#c9b896]/30"
              >
                <Image
                  src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1772005762/FC0A8087.JPG_eawuwa.jpg"
                  alt="Rakesh Yadav - CEO"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[#c9b896] to-[#a08968] text-black px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm"
              >
                <div className="text-sm font-light">Since</div>
                <div className="text-3xl font-bold">2021</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div variants={itemVariants} className="lg:order-2 space-y-6">
            
            {/* Greeting with elegant typography */}
            <motion.div variants={itemVariants} className="space-y-2">
              <motion.h2 
                className="text-5xl sm:text-6xl md:text-7xl font-light text-white tracking-tight"
                style={{ fontFamily: 'Georgia, serif' }}
                {...(!shouldReduceMotion && {
                  whileHover: { x: 10 },
                  transition: { type: "spring", stiffness: 300 }
                })}
              >
                Namaste
              </motion.h2>
              
              <motion.div className="h-1 w-20 bg-gradient-to-r from-[#c9b896] to-transparent" 
                          initial={{ width: 0 }}
                          animate={isInView ? { width: 80 } : { width: 0 }}
                          transition={{ delay: 0.8, duration: 0.8 }}
              />
            </motion.div>

            {/* Name and Title */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#c9b896]">
                I'm Rakesh Yadav
              </h3>
              <p className="text-lg sm:text-xl text-white/70 tracking-wide font-light">
                Founder & CEO | In Silk Yatra DMC
              </p>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed">
              <p className="text-white/80">
                Since 2021, we have been proudly operating as a Kazakhstan-based Destination Management Company, providing comprehensive ground handling services for global travel partners and discerning travelers.
              </p>
              <p className="text-white/70">
                Headquartered in Almaty, we bring in-depth destination expertise, strong local networks, and hands-on operational excellence.
              </p>
            </motion.div>

            {/* Specialties with staggered animation */}
            <motion.div variants={itemVariants} className="space-y-4 pt-4">
              <h4 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="w-2 h-2 bg-[#c9b896] rounded-full animate-pulse" />
                Our Expertise
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specialties.map((specialty, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={specialtyVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    {...(!shouldReduceMotion && {
                      whileHover: { x: 5, backgroundColor: 'rgba(201, 184, 150, 0.1)' }
                    })}
                    className="flex items-center gap-3 p-3 rounded-lg border border-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    <div className="w-1.5 h-1.5 bg-[#c9b896] rounded-full" />
                    <span className="text-sm text-white/80">{specialty}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Closing Statement */}
            <motion.div 
              variants={itemVariants}
              className="pt-6 border-t border-white/10"
            >
              <p className="text-white/70 leading-relaxed mb-4">
                At In Silk Yatra DMC, our focus is simple: deliver professionally managed journeys backed by local knowledge, transparency, and long-term partnership values.
              </p>
              <motion.div 
                className="inline-block"
                {...(!shouldReduceMotion && {
                  whileHover: { scale: 1.05 },
                  transition: { type: "spring", stiffness: 400 }
                })}
              >
                <p className="text-[#c9b896] font-semibold text-lg">
                  Travel Safe | Travel Smart
                </p>
                <p className="text-white/60 mt-1 italic">Thanks</p>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
