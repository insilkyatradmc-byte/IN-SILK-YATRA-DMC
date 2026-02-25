'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import ScrollReveal from '@/components/about/ScrollReveal'
import SplitImageWithOverlay from '@/components/about/SplitImageWithOverlay'
import CEOSection from '@/components/about/CEOSection'
import BackgroundImageSection from '@/components/about/BackgroundImageSection'
import LargeTextAnimation from '@/components/about/LargeTextAnimation'
import { ArcGalleryHero } from '@/components/ui/arc-gallery-hero'

const DestinationsGallery = dynamic(() => import('@/components/home/DestinationsGallery'), {
  loading: () => <div className="min-h-screen bg-black" />
})

function AboutPage() {
  const travelImages = [
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771595975/some-autumn-views-of-almaty-city-v0-9j3t78sn981e1_igfg1q.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771595509/Alpine_meadows_and_snow-covered_peaks_in_Khan_Tengri_Nature_Park__Tien_Shan_1_fekbui.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771595311/kolsay-lake-1-credit-to-rachita-saxena_bfefxq.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771595312/visitalmatykz-visitalmaty-3457149_e5xwdy.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771515856/milapom-kazakhstan-5434504_qa8ien.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771515855/andy_bay-canyon-1740973_refb2k.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901827/ira_b-mountains-4895894_i4qa2r.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901572/tom_aaa-kazakhstan-2726987_anijc6.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770881292/andy_bay-mountains-8446221_ihswhz.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770881291/bahonya-buildings-6282097_thp5xq.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771664152/insilk_yatra/destinations/rcaemudbjocefft28tto.jpg',
    'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771663891/insilk_yatra/destinations/mekas76fngagf661ph9f.jpg',
  ]

  return (
    <div className="bg-[#e8e6e1] overflow-hidden">
      <ArcGalleryHero 
        images={travelImages}
        title="ABOUT IN-SILK YATRA DMC"
        subtitle="Crafting authentic journeys across Central Asia — where every path tells a story and every moment becomes a memory"
      />

      <SplitImageWithOverlay
        leftSrc="https://res.cloudinary.com/dzbk92wsh/image/upload/v1772006121/row-1-column-1_1_l7urgj.jpg"
        rightSrc="https://res.cloudinary.com/dzbk92wsh/image/upload/v1772006132/row-1-column-2_mbvhqu.jpg"
        alt="Central Asian Art and Culture"
      />

      <CEOSection />

      <DestinationsGallery />

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

          <div className="relative mt-32 mb-20">
            <LargeTextAnimation text="IN-SILK" direction="left" delay={0} />
            <div className="mt-4">
              <LargeTextAnimation text="YATRA DMC" direction="right" delay={0.2} />
            </div>
          </div>
        </div>
      </section>

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
                and Central Asia. We don&apos;t just show you destinations—we help you discover the soul 
                of the Silk Road, one meaningful moment at a time.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
