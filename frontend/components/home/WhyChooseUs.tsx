'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, MapPin, Star, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: React.ElementType
  value: string
  label: string
  trend: string
  trendUp: boolean
  index: number
}

function StatCard({ icon: Icon, value, label, trend, trendUp, index }: StatCardProps) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Extract number from value string (e.g., "2000+" -> 2000)
  const targetNumber = parseInt(value.replace(/\D/g, ''))
  const suffix = value.replace(/[0-9]/g, '')

  useEffect(() => {
    if (isInView && !hasAnimated && targetNumber) {
      setHasAnimated(true)
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = targetNumber / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= targetNumber) {
          setCount(targetNumber)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, hasAnimated, targetNumber])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      className="group flex gap-0 flex-col justify-between p-6 lg:p-8 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm hover:border-[#c9b896]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#c9b896]/10"
    >
      <Icon className={cn(
        "w-5 h-5 mb-10 transition-transform duration-300 group-hover:scale-110",
        trendUp ? "text-[#c9b896]" : "text-[#c9b896]/60"
      )} />
      
      <div className="flex flex-col gap-2 mb-3">
        <h2 className="text-4xl lg:text-5xl tracking-tight text-left font-sans font-semibold text-white leading-none">
          {count > 0 ? count.toLocaleString() : targetNumber.toLocaleString()}
          <span className="text-[#c9b896] font-normal ml-1">{suffix}</span>
        </h2>
        <span className="text-[#c9b896]/70 text-sm font-sans font-medium inline-block">
          {trend}
        </span>
      </div>
      
      <p className="text-base leading-relaxed tracking-tight text-white/60 max-w-xl text-left">
        {label}
      </p>

      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#c9b896]/0 to-[#c9b896]/0 group-hover:from-[#c9b896]/5 group-hover:to-transparent rounded-2xl transition-all duration-500 pointer-events-none" />
    </motion.div>
  )
}

export default function WhyChooseUs() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const stats = [
    {
      icon: Users,
      value: '2000+',
      label: 'Comprehensive group tours across Kazakhstan and throughout Central Asia.',
      trend: '+20.1%',
      trendUp: true,
    },
    {
      icon: MapPin,
      value: '50+',
      label: 'Diverse locations from pristine lakes to ancient cultural sites across the Silk Road.',
      trend: '+15%',
      trendUp: true,
    },
    {
      icon: Star,
      value: '100+',
      label: 'Curated adventures combining luxury, culture, and authentic local encounters.',
      trend: '+8%',
      trendUp: true,
    },
    {
      icon: Heart,
      value: '10000+',
      label: 'Satisfied clients who trust us for their unforgettable journeys through Central Asia.',
      trend: '+25%',
      trendUp: true,
    },
  ]

  return (
    <section ref={sectionRef} className="relative w-full py-20 lg:py-32 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#c9b896]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#c9b896]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Side - Text Content */}
          <div className="flex gap-6 flex-col items-start justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-[#c9b896]/10 text-[#c9b896] border-[#c9b896]/20 hover:bg-[#c9b896]/20">
                Our Expertise & Excellence
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex gap-4 flex-col"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-serif font-regular text-left text-white leading-tight">
                Why Choose <span className="text-[#c9b896]">IN-SILK YATRA DMC</span>
              </h2>
              <p className="text-base lg:text-lg lg:max-w-lg leading-relaxed tracking-tight text-white/60 text-left">
                Delivering exceptional travel experiences through our commitment to quality,
                innovation, and customer satisfaction. Join thousands of travelers who have
                discovered the beauty of Central Asia with us.
              </p>
            </motion.div>
          </div>

          {/* Right Side - Stats Grid */}
          <div className="flex justify-center items-center">
            <div className="grid text-left grid-cols-1 sm:grid-cols-2 w-full gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
