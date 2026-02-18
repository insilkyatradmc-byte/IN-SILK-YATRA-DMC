'use client'

import dynamic from 'next/dynamic'
import Hero from '@/components/home/Hero'

// Lazy load heavy components for better performance
const PhilosophySection = dynamic(() => import('@/components/home/PhilosophySection'), {
  loading: () => <div className="min-h-screen bg-black" />
})
const CinematicTransition = dynamic(() => import('@/components/home/CinematicTransition'), {
  loading: () => <div className="min-h-[40vh] bg-black" />
})
const BoutiqueSilkRoadHotelsSection = dynamic(() => import('@/components/home/BoutiqueSilkRoadHotelsSection'), {
  loading: () => <div className="min-h-screen bg-black" />
})
const ImmersiveVideoSection = dynamic(() => import('@/components/home/ImmersiveVideoSection'), {
  loading: () => <div className="min-h-screen bg-black" />
})
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  loading: () => <div className="min-h-[60vh] bg-black" />
})

export default function Home() {
  return (
    <div>
      <Hero />
      <PhilosophySection />
      <CinematicTransition />
      <BoutiqueSilkRoadHotelsSection />
      <ImmersiveVideoSection />
      <Testimonials />
    </div>
  )
}
