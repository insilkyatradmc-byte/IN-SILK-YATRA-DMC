'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fixedState, setFixedState] = useState<'absolute-top' | 'fixed' | 'absolute-bottom'>('absolute-top');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Track scroll progress
  const { scrollY, scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    mass: 0.5
  });

  // Calculate Fixed State Logic manually to bypass sticky issues
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!containerRef.current) return;
    
    // Using absolute layout pixel calculations for maximum reliability
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Calculate entry and exit points
    // When viewport matches container top -> We enter fixed state
    // When viewport matches (container bottom - viewport height) -> We exit fixed state
    
    const startFixed = containerTop;
    const endFixed = containerTop + containerHeight - viewportHeight;
    
    if (latest < startFixed) {
        if (fixedState !== 'absolute-top') setFixedState('absolute-top');
    } else if (latest >= startFixed && latest < endFixed) {
        if (fixedState !== 'fixed') setFixedState('fixed');
    } else {
        if (fixedState !== 'absolute-bottom') setFixedState('absolute-bottom');
    }
  });

  // Animations (linked to the same progress)
  const widthInfo = useTransform(smoothProgress, [0, 0.7], ['30vh', '100%']); 
  const heightInfo = useTransform(smoothProgress, [0, 0.7], ['40vh', '100%']);
  const borderRadius = useTransform(smoothProgress, [0.6, 0.7], ['24px', '0px']);
  const textTranslateLeft = useTransform(smoothProgress, [0, 0.6], ['0%', '-150%']);
  const textTranslateRight = useTransform(smoothProgress, [0, 0.6], ['0%', '150%']);
  const textOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const contentOpacity = useTransform(smoothProgress, [0.75, 0.9], [0, 1]);
  const contentY = useTransform(smoothProgress, [0.75, 0.9], [50, 0]);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full bg-white">
      
      {/* 
        Manual Fixed Position Switcher 
        This bypasses any 'overflow' issues in parents that break 'position: sticky'.
        Since we toggle 'fixed' class, the browser handles the position painting, eliminating jitter.
      */}
      <div 
        className={`w-full h-screen overflow-hidden bg-white z-10 flex flex-col items-center justify-center will-change-transform ${
          fixedState === 'fixed' 
            ? 'fixed top-0 left-0' 
            : fixedState === 'absolute-bottom' 
              ? 'absolute bottom-0 left-0' 
              : 'absolute top-0 left-0'
        }`}
      >
        
        {/* Background */}
        <div className="absolute inset-0 bg-white z-0" />

        {/* Media Container */}
        <motion.div
            style={{
              width: widthInfo,
              height: heightInfo,
              borderRadius,
            }}
            className="relative z-10 overflow-hidden shadow-2xl origin-center will-change-[width,height,border-radius]"
        >
          {mediaType === 'video' ? (
            <div className="relative w-full h-full">
              <video
                src={mediaSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={mediaSrc}
                alt={title || 'Media content'}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
           {/* Attached Text (Date/Label) */}
           <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center pointer-events-none">
              {date && (
                <motion.p style={{ opacity: textOpacity }} className="text-white/90 text-xl font-medium mb-2 drop-shadow-md">
                  {date}
                </motion.p>
              )}
              {scrollToExpand && (
                <motion.p style={{ opacity: textOpacity }} className="text-white text-sm uppercase tracking-widest drop-shadow-md">
                  {scrollToExpand}
                </motion.p>
              )}
           </div>
        </motion.div>

        {/* Big Title Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 mix-blend-difference">
             <div className="flex gap-4 md:gap-8 items-center">
                 <motion.h2 
                    style={{ x: textTranslateLeft, opacity: textOpacity }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white whitespace-nowrap will-change-transform"
                 >
                     {firstWord}
                 </motion.h2>
                 <motion.h2 
                    style={{ x: textTranslateRight, opacity: textOpacity }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white whitespace-nowrap will-change-transform"
                 >
                     {restOfTitle}
                 </motion.h2>
             </div>
        </div>

        {/* Bottom Content (Revealed at end) */}
         <motion.div 
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute inset-x-0 bottom-0 min-h-[50vh] flex items-center justify-center p-8 z-30 pointer-events-auto bg-gradient-to-t from-black/80 to-transparent"
         >
            {children}
         </motion.div>

      </div>
    </div>
  );
};

export default ScrollExpandMedia;
