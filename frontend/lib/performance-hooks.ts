'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect mobile devices for performance optimization
 * Returns true for screens < 768px (mobile/tablet)
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Listen for resize
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

/**
 * Hook to detect user's preference for reduced motion
 * Used to disable animations for accessibility and performance
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  return prefersReducedMotion
}

/**
 * Combined hook - disable animations on mobile OR if user prefers reduced motion
 */
export function useShouldReduceMotion(): boolean {
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()

  return isMobile || prefersReducedMotion
}
