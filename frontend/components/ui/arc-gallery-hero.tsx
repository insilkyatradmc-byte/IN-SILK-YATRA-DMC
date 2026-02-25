'use client';

import React, { useEffect, useState } from 'react';
import SimpleInquiryModal from '@/components/common/SimpleInquiryModal';

// --- The ArcGalleryHero Component ---
type ArcGalleryHeroProps = {
  images: string[];
  startAngle?: number;
  endAngle?: number;
  // radius for different screen sizes
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  // size of each card for different screen sizes
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  // optional extra class on outer section
  className?: string;
  title?: string;
  subtitle?: string;
};

export const ArcGalleryHero: React.FC<ArcGalleryHeroProps> = ({
  images,
  startAngle = 20,
  endAngle = 160,
  radiusLg = 480,
  radiusMd = 360,
  radiusSm = 260,
  cardSizeLg = 120,
  cardSizeMd = 100,
  cardSizeSm = 80,
  className = '',
  title = 'Discover Central Asia',
  subtitle = 'Experience the beauty, culture, and heritage of the Silk Road through our curated journeys',
}) => {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [dimensions, setDimensions] = useState({
    radius: radiusLg,
    cardSize: cardSizeLg,
  });

  // Effect to handle responsive resizing of the arc and cards
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
      } else if (width < 1024) {
        setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
      } else {
        setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  // Ensure at least 2 points to distribute angles for the arc calculation
  const count = Math.max(images.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section className={`relative overflow-hidden bg-[#e8e6e1] text-[#1c1917] min-h-screen flex flex-col pt-20 md:pt-24 ${className}`}>
      {/* Background ring container that controls geometry */}
      <div
        className="relative mx-auto"
        style={{
          width: '100%',
          // Give it a bit more height to prevent clipping
          height: dimensions.radius * 1.2,
        }}
      >
        {/* Center pivot for transforms - positioned at bottom center */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
          {/* Each image is positioned on the circle and rotated to face outward */}
          {images.map((src, i) => {
            const angle = startAngle + step * i; // degrees
            const angleRad = (angle * Math.PI) / 180;
            
            // Calculate x and y positions on the arc
            const x = Math.cos(angleRad) * dimensions.radius;
            const y = Math.sin(angleRad) * dimensions.radius;
            
            return (
              <div
                key={i}
                className="absolute opacity-0 animate-fade-in-up"
                style={{
                  width: dimensions.cardSize,
                  height: dimensions.cardSize,
                  left: `calc(50% + ${x}px)`,
                  bottom: `${y}px`,
                  transform: `translate(-50%, 50%)`,
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: 'forwards',
                  zIndex: count - i,
                }}
              >
                <div 
                  className="rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-300 bg-white transition-transform hover:scale-110 hover:shadow-3xl w-full h-full cursor-pointer"
                  style={{ transform: `rotate(${angle / 4}deg)` }}
                >
                  <img
                    src={src}
                    alt={`Central Asia ${i + 1}`}
                    className="block w-full h-full object-cover"
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop`;
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content positioned below the arc */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 -mt-40 md:-mt-52 lg:-mt-64">
        <div className="text-center max-w-3xl px-6 opacity-0 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-light tracking-tight text-[#1c1917] leading-tight">
            {title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-[#44403c] font-light leading-relaxed">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/tours"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1c1917] text-[#e8e6e1] hover:bg-[#44403c] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 font-light tracking-wider text-sm uppercase"
            >
              Explore Tours
            </a>
            <button 
              onClick={() => setShowInquiryForm(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-[#1c1917] text-[#1c1917] hover:bg-[#1c1917] hover:text-[#e8e6e1] transition-all duration-300 font-light tracking-wider text-sm uppercase"
            >
              Plan Your Journey
            </button>
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, 60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 50%);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation-name: fade-in-up;
          animation-duration: 0.8s;
          animation-timing-function: ease-out;
        }
        .animate-fade-in {
          animation-name: fade-in;
          animation-duration: 0.8s;
          animation-timing-function: ease-out;
        }
      `}</style>
      
      {/* Inquiry Form Modal */}
      <SimpleInquiryModal 
        isOpen={showInquiryForm} 
        onClose={() => setShowInquiryForm(false)} 
      />
    </section>
  );
};
