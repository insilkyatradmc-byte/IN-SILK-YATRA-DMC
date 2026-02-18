'use client'

import { useEffect, useRef } from 'react'

interface SliderIndexProps {
  current: number
  total: number
}

export default function SliderIndex({ current, total }: SliderIndexProps) {
  const indexRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateIndex = async () => {
      const { gsap } = await import('gsap')
      
      if (indexRef.current) {
        // Cross-dissolve fade for index
        gsap.to(indexRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.to(indexRef.current, {
              opacity: 1,
              duration: 0.2,
              ease: 'power2.inOut',
            })
          },
        })
      }

      if (progressRef.current) {
        // Progress line fill
        gsap.to(progressRef.current, {
          width: `${((current + 1) / total) * 100}%`,
          duration: 1.2,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
        })
      }
    }

    updateIndex()
  }, [current, total])

  return (
    <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-30">
      {/* Index Number */}
      <div
        ref={indexRef}
        className="mb-4 text-right"
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(1.5rem, 2vw, 2rem)',
          color: '#666',
        }}
      >
        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {/* Progress Line */}
      <div className="w-32 h-[1px] bg-white/20 relative overflow-hidden">
        <div
          ref={progressRef}
          className="absolute left-0 top-0 h-full bg-white/60"
          style={{ width: '33.33%' }}
        />
      </div>
    </div>
  )
}
