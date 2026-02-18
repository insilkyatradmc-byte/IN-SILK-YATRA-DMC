'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Hero() {
  const [videoError, setVideoError] = useState(false)
  const HERO_VIDEO_URL = 'https://res.cloudinary.com/dzbk92wsh/video/upload/v1770100645/Hero_Video_u9ex0y.mp4'

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {!videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            onError={() => setVideoError(true)}
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-700 to-stone-600" />
        )}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      </div>

      {/* Hero Content - Centered */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-wider mb-8 md:mb-12 uppercase leading-tight">
            CENTRAL ASIAN TRAVEL
            <br />
            <span className="font-normal">REDEFINED</span>
          </h1>
          
          {/* CTA Button - IN-SILK YATRA Style */}
          <Link 
            href="/inquiry"
            className="group relative inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white font-sans text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 hover:text-stone-800"
          >
            <span className="relative z-10 transition-colors duration-500">
              DEFINE YOUR JOURNEY
            </span>
            <span className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  )
}
