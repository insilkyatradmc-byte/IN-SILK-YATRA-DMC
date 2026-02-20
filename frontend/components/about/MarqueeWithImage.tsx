'use client'

interface MarqueeWithImageProps {
  text: string
  imageSrc: string
  imageAlt: string
  speed?: number
}

export default function MarqueeWithImage({ text, imageSrc, imageAlt, speed = 50 }: MarqueeWithImageProps) {
  const marqueeText = `${text} • ${text} • ${text} • ${text} • ${text} • `

  return (
    <div className="relative h-screen bg-[#e8e6e1] overflow-hidden flex items-center justify-center">

      {/* Pure CSS marquee in background */}
      <style>{`
        @keyframes marquee-infinite {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none z-0">
        <div
          className="whitespace-nowrap"
          style={{ animation: `marquee-infinite ${speed}s linear infinite` }}
        >
          <span className="inline-block text-[15vw] font-serif text-[#1c1917] opacity-25 tracking-[0.1em] uppercase select-none">
            {marqueeText}
          </span>
          <span className="inline-block text-[15vw] font-serif text-[#1c1917] opacity-25 tracking-[0.1em] uppercase select-none">
            {marqueeText}
          </span>
        </div>
      </div>

      {/* Static centered image — no scroll animation */}
      <div className="relative z-10 flex justify-center">
        <div className="relative w-[250px] md:w-[350px] aspect-[3/4]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </div>

    </div>
  )
}
