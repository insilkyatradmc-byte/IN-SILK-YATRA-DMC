'use client'

import dynamic from 'next/dynamic'
import Hero from '@/components/home/Hero'

// Lazy load heavy components for better performance
const PhilosophySection = dynamic(() => import('@/components/home/PhilosophySection'), {
  loading: () => <div className="min-h-screen bg-black" />
})
const DestinationsShowcase = dynamic(() => import('@/components/home/DestinationsShowcase'), {
  loading: () => <div className="min-h-[40vh] bg-black" />
})
const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs'), {
  loading: () => <div className="min-h-[40vh] bg-black" />
})
const KineticScrollGallery = dynamic(() => import('@/components/ui/kinetic-scroll-gallery'), {
  loading: () => <div className="min-h-screen bg-black" />
})
const BoutiqueSilkRoadHotelsSection = dynamic(() => import('@/components/home/BoutiqueSilkRoadHotelsSection'), {
  loading: () => <div className="min-h-screen bg-black" />
})
const LuminaSection = dynamic(() => import('@/components/ui/lumina-interactive-list').then(mod => mod.Component), {
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
      <DestinationsShowcase />
      <WhyChooseUs />
      <KineticScrollGallery />
      <BoutiqueSilkRoadHotelsSection />
      <LuminaSection />
      <Testimonials />
    </div>
  )
}
