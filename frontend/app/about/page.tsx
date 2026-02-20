'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from '@/components/about/ScrollReveal'
import SplitImageWithOverlay from '@/components/about/SplitImageWithOverlay'
import BackgroundImageSection from '@/components/about/BackgroundImageSection'
import LargeTextAnimation from '@/components/about/LargeTextAnimation'
import MarqueeWithImage from '@/components/about/MarqueeWithImage'

gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  // After all child components' rAF-deferred GSAP setups have fired in frame N,
  // this double-rAF fires in frame N+1 and forces ScrollTrigger to recalculate
  // all pinned-section scroll distances with the fully-painted layout.
  useEffect(() => {
    const inner = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    })
    return () => cancelAnimationFrame(inner)
  }, [])

  return (
    <div className="bg-[#e8e6e1] overflow-hidden">
      {/* Scrolling Marquee with Image Animation */}
      <MarqueeWithImage
        text="ABOUT IN-SILK YATRA DMC"
        imageSrc="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770887096/thephilippena-mosque-331116_vuxklb.jpg"
        imageAlt="Kazakhstan Mosque"
        speed={50}
      />

      {/* Split Image with Overlay - A SHARED STORY */}
      <SplitImageWithOverlay
        leftSrc="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770882318/konevi-cami-5103317_xpw4di.jpg"
        rightSrc="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770882319/konevi-cami-5103317_1_qcpnkc.jpg"
        alt="Central Asian Art and Culture"
      />

      {/* WHERE IT ALL BEGAN - Background Image Section */}
      <BackgroundImageSection
        src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770881292/andy_bay-mountains-8446221_ihswhz.jpg"
        alt="Kazakhstan Landscape"
        title="WHERE IT ALL BEGAN"
        subtitle="It began in Kazakhstan — not as a plan, but as a feeling of belonging."
        paragraphs={[
          "A bond with a place that teaches patience, humility, and depth. A place that asks you to slow down, to look closer, to listen before you speak.",
          "Kazakhstan shaped our way of moving through the world. Its contrasts, its silences, its stories passed quietly from one generation to the next. From there, IN-SILK YATRA grew — carrying this sensibility across Central Asia."
        ]}
      />

      {/* Where It All Starts Section */}
      <section className="min-h-screen bg-black text-white flex items-center justify-center px-8 py-20">
        <div className="max-w-6xl w-full">
          <ScrollReveal direction="up">
            <h2 className="text-[6vw] md:text-[5vw] font-serif font-light text-center leading-tight mb-12">
              WHERE IT ALL<br />STARTS - WITH YOU
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="relative aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770881294/konevi-cami-4274663_zd69xl.jpg"
                  alt="Kazakhstan Traditional Art"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal direction="up" delay={0.2}>
                <p className="text-lg md:text-xl font-light leading-relaxed text-[#d4c5b0]">
                  <span className="block mb-4 text-2xl">BEFORE<br />DESTINATIONS.<br />BEFORE IDEAS.</span>
                </p>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={0.3}>
                <p className="text-base md:text-lg leading-relaxed opacity-80">
                  Every journey begins long before a place is chosen. It begins with a person — their 
                  rhythm, their curiosity, their unspoken expectations. The way they move through 
                  the world. The things that move them in return.
                </p>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={0.4}>
                <p className="text-base md:text-lg leading-relaxed opacity-80">
                  We start there. By listening carefully, without assumptions or templates. When a 
                  journey is shaped around who you are — not around an itinerary — everything else 
                  finds its place.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Kazakhstan Awaits Section */}
      <section className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden py-20">
        <div className="max-w-6xl w-full px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770881293/konevi-architectural-5101024_fdx179.jpg"
                  alt="Kazakhstan Architecture"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>

            <div className="space-y-8">
              <ScrollReveal direction="up" delay={0.2}>
                <h3 className="text-3xl md:text-4xl font-serif font-light leading-tight">
                  Discover the heart of Central Asia through authentic experiences. Where ancient traditions meet boundless landscapes.
                </h3>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={0.3}>
                <p className="text-lg md:text-xl leading-relaxed opacity-80">
                  From the vast steppes to snow-capped mountains, from bustling Almaty to serene Charyn Canyon—Kazakhstan offers adventures that transform perspectives. We bring you closer to nomadic heritage, natural wonders, and the warmth of Kazakh hospitality.
                </p>
              </ScrollReveal>
            </div>
          </div>

          {/* Large Text Animations */}
          <div className="relative mt-32 mb-20">
            <LargeTextAnimation text="IN-SILK" direction="left" delay={0} />
            <div className="mt-4">
              <LargeTextAnimation text="YATRA DMC" direction="right" delay={0.2} />
            </div>
          </div>
        </div>
      </section>

      {/* Two Images Side by Side Section */}
      <section className="min-h-screen bg-[#e8e0d5] px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={0}>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770881296/niki7mcrae-city-4229352_xkqhbj.jpg"
                  alt="Kazakhstan Culture"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770881291/bahonya-buildings-6282097_thp5xq.jpg"
                  alt="Central Asian Landscapes"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <ScrollReveal direction="up" delay={0.3}>
              <h3 className="text-3xl md:text-4xl font-serif font-light mb-6 text-gray-800">
                Your Journey, Redefined
              </h3>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={0.4}>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                IN-SILK YATRA DMC specializes in crafting bespoke travel experiences across Kazakhstan 
                and Central Asia. We don't just show you destinations—we help you discover the soul 
                of the Silk Road, one meaningful moment at a time.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}
