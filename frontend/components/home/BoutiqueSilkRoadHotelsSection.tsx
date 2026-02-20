'use client'

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from '@/components/ui/ClientOnly';

// Dynamically import the controlled 3D gallery component with SSR disabled
const ControlledGallery = dynamic(
  () => import("@/components/ui/controlled-3d-gallery"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading Gallery...</div>
      </div>
    )
  }
);

export default function BoutiqueSilkRoadHotelsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const scrollAccumulator = useRef(0);
  const touchStartY = useRef(0);

  // 10 curated images
  const boutiqueSilkRoadImages = [
    { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80', alt: 'Luxury boutique hotel exterior' },
    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80', alt: 'Traditional silk road architecture' },
    { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80', alt: 'Intimate hotel pool' },
    { src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80', alt: 'Boutique hotel bedroom' },
    { src: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&auto=format&fit=crop&q=80', alt: 'Ancient silk road destination' },
    { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80', alt: 'Hotel lounge area' },
    { src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80', alt: 'Traditional architecture detail' },
    { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80', alt: 'Boutique hotel terrace' },
    { src: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=80', alt: 'Silk road landscape' },
    { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80', alt: 'Intimate hotel courtyard' },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top <= 0 && rect.bottom > window.innerHeight;
      
      if (rect.top <= 0 && scrollProgress < 100) {
        setIsSticky(true);
      } else if (scrollProgress >= 100 && rect.top <= -100) {
        setIsSticky(false);
      } else if (rect.top > 0) {
        setIsSticky(false);
        setScrollProgress(0);
        scrollAccumulator.current = 0;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const isAtTop = rect.top <= 1 && rect.top >= -1;
      
      if (isAtTop || (isSticky && scrollProgress < 100)) {
        // Add to accumulator
        scrollAccumulator.current += e.deltaY;
        
        // Calculate progress (0-100)
        // Each image needs ~200px of scroll, so 10 images = 2000px total
        const maxScroll = 2000;
        const newProgress = Math.max(0, Math.min(100, (scrollAccumulator.current / maxScroll) * 100));
        
        setScrollProgress(newProgress);
        
        if (newProgress < 100 && newProgress > 0) {
          e.preventDefault();
          setIsSticky(true);
        } else if (newProgress >= 100 && e.deltaY > 0) {
          // Allow scrolling down when finished
          setIsSticky(false);
        } else if (newProgress <= 0 && e.deltaY < 0) {
          // Allow scrolling up when at start
          scrollAccumulator.current = 0;
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = section.getBoundingClientRect();
      const isAtTop = rect.top <= 1 && rect.top >= -1;

      if (isAtTop || (isSticky && scrollProgress < 100)) {
        const deltaY = touchStartY.current - e.touches[0].clientY;
        touchStartY.current = e.touches[0].clientY;
        scrollAccumulator.current += deltaY;

        const maxScroll = 2000;
        const newProgress = Math.max(0, Math.min(100, (scrollAccumulator.current / maxScroll) * 100));
        setScrollProgress(newProgress);

        if (newProgress < 100 && newProgress > 0) {
          e.preventDefault();
          setIsSticky(true);
        } else if (newProgress >= 100 && deltaY > 0) {
          setIsSticky(false);
        } else if (newProgress <= 0 && deltaY < 0) {
          scrollAccumulator.current = 0;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [scrollProgress, isSticky]);

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full bg-black ${isSticky ? 'h-screen sticky top-0' : 'h-screen'}`}
    >
      <ClientOnly>
        <ControlledGallery
          images={boutiqueSilkRoadImages}
          progress={scrollProgress}
          className="h-screen w-full"
        />
      </ClientOnly>
      
      {/* Overlay Text Content */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-center px-4 mix-blend-exclusion">
        <div className="max-w-4xl">
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight text-white mb-6">
            <span className="italic">Boutique Silk Road Hotels</span>
          </h2>
          <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Because intimacy always leaves the deepest mark.
          </p>
          <p className="text-white/90 text-sm mt-4 leading-relaxed">
            Here, ancient traditions meet modern comfort and silence becomes the new indulgence.
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-10 right-10 text-white/70 font-mono text-xs">
        <div className="text-right mb-2">
          {Math.round(scrollProgress)}%
        </div>
        <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/70 transition-all duration-200"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Navigation Instructions removed */}
    </section>
  );
}
