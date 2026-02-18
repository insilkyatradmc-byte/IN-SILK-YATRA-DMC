'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [imageVisible, setImageVisible] = useState(false)
  const [headingVisible, setHeadingVisible] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animations when scrolling into view
            setTimeout(() => setImageVisible(true), 100)
            setTimeout(() => setHeadingVisible(true), 400)
            setTimeout(() => setTextVisible(true), 800)
          } else {
            // Reverse animations when scrolling out of view
            setTextVisible(false)
            setHeadingVisible(false)
            setImageVisible(false)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-[#1a1a1a] overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-0 flex">
          <div
            className={`absolute inset-0 transition-transform duration-1000 ease-out ${
              imageVisible ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <img
              src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770216435/visitalmatykz-visitalmaty-3457152_1920_vijloz.jpg"
              alt="Central Asian Landscape"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side - Content (NO Overlap - Clean Dark Section) */}
        <div className="w-full md:w-1/2 bg-[#1a1a1a] flex items-center justify-center px-8 md:px-12 lg:px-16 py-16 md:py-20 min-h-screen">
          <div className="max-w-xl w-full">
            {/* Heading with fade-in from bottom */}
            <h2
              className={`font-serif text-4xl md:text-5xl lg:text-6xl text-[#c9b896] mb-8 transition-all duration-1000 ease-out ${
                headingVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              CRAFTED IN SILK ROAD.
              <br />
              DEFINED BY
              <br />
              CENTRAL ASIA.
            </h2>

            {/* Paragraph with fade-in */}
            <p
              className={`text-white/80 text-base md:text-lg leading-relaxed mb-12 transition-all duration-1000 ease-out delay-300 ${
                textVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              IN-SILK YATRA was born along the ancient Silk Road — a land where
              vast steppes meet majestic mountains, and nomadic traditions blend
              with modern exploration. It's here that we discovered the art of
              authentic travel: adventure and comfort, heritage and innovation,
              wilderness and wonder. From this spirit grew our vision — to
              redefine Central Asian travel through emotion, precision, and
              place. What began as a passion became an art form: the design of
              journeys that feel as alive and timeless as the Silk Road itself.
            </p>

            {/* Arrow Button with simultaneous text appearance and arrow shrink */}
            <div
              className={`transition-all duration-1000 ease-out delay-500 ${
                textVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-0 group relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="relative flex items-center">
                  {/* Text appears in place */}
                  <span
                    className={`text-white font-sans text-sm tracking-[0.2em] uppercase transition-all duration-500 ease-out whitespace-nowrap absolute left-0 ${
                      isHovered
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  >
                    OUR PHILOSOPHY
                  </span>

                  {/* Arrow - shrinks in place as text appears */}
                  <div className="flex items-center relative">
                    <div
                      className={`h-[2px] bg-white transition-all duration-500 ease-out origin-right ${
                        isHovered ? 'w-12 ml-[168px]' : 'w-24'
                      }`}
                    ></div>
                    <svg
                      className="w-4 h-4 text-white transition-transform duration-500 ease-out"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
