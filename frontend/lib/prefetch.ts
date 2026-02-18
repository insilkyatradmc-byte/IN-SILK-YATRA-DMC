// Route prefetching utility
// This helps prefetch routes that users are likely to visit

export const prefetchRoutes = () => {
  if (typeof window === 'undefined') return

  // Common routes to prefetch
  const routes = [
    '/destinations',
    '/tours',
    '/about',
    '/contact',
  ]

  routes.forEach(route => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    link.as = 'document'
    document.head.appendChild(link)
  })
}

// Prefetch on hover for better UX
export const setupHoverPrefetch = () => {
  if (typeof window === 'undefined') return

  const links = document.querySelectorAll('a[href^="/"]')
  
  links.forEach(link => {
    link.addEventListener('mouseenter', function(this: HTMLAnchorElement) {
      const href = this.getAttribute('href')
      if (!href) return

      const prefetchLink = document.createElement('link')
      prefetchLink.rel = 'prefetch'
      prefetchLink.href = href
      prefetchLink.as = 'document'
      document.head.appendChild(prefetchLink)
    }, { once: true, passive: true })
  })
}
