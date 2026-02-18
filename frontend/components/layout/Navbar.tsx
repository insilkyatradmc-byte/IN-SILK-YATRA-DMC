'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { auth, User } from '@/lib/auth'
import { adminAuth, Admin } from '@/lib/admin-auth'
import MultiStepInquiryForm from '@/components/common/MultiStepInquiryForm'
import { throttle } from '@/lib/performance'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/tours', label: 'Tours' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoverBurger, setHoverBurger] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showInquiryForm, setShowInquiryForm] = useState(false)

  useEffect(() => {
    const syncUser = () => setUser(auth.getUser())
    const syncAdmin = () => setAdmin(adminAuth.getAdmin())
    syncUser()
    syncAdmin()
    window.addEventListener('auth_changed', syncUser)
    window.addEventListener('admin_auth_changed', syncAdmin)
    
    // Listen for custom event to open inquiry form
    const handleOpenInquiryForm = () => setShowInquiryForm(true)
    window.addEventListener('openInquiryForm', handleOpenInquiryForm)
    
    return () => {
      window.removeEventListener('auth_changed', syncUser)
      window.removeEventListener('admin_auth_changed', syncAdmin)
      window.removeEventListener('openInquiryForm', handleOpenInquiryForm)
    }
  }, [])

  useEffect(() => {
    const onScroll = throttle(() => {
      const currentScrollY = window.scrollY
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsNavVisible(false)
      } else {
        // Scrolling up - show navbar
        setIsNavVisible(true)
      }
      
      setLastScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 24)
    }, 100) // Throttle to every 100ms max
    
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.classList.remove('menu-open')
      document.body.style.overflow = ''
    }
    return () => { 
      document.body.classList.remove('menu-open')
      document.body.style.overflow = '' 
    }
  }, [isMenuOpen])

  const handleLogout = useCallback(async () => {
    await auth.logout()
    setUser(null)
    window.location.href = '/'
  }, [])

  const handleAdminLogout = useCallback(async () => {
    await adminAuth.logout()
    setAdmin(null)
    window.location.href = '/'
  }, [])

  const closeMenu = useCallback(() => {
    setIsClosing(true)
    // Start button transition immediately
    setIsMenuOpen(false)
    // Reset closing state after animations complete
    setTimeout(() => {
      setIsClosing(false)
    }, 600) // Match the longest text animation delay + duration
  }, [])

  const navContent = [
    ...navLinks,
    ...(admin
      ? [
          { href: '/admin/dashboard', label: 'Admin Dashboard', auth: true },
          { action: 'adminLogout', label: 'Admin Logout', auth: true },
        ]
      : user
        ? [
            { href: '/dashboard', label: 'Dashboard', auth: true },
            { action: 'logout', label: 'Logout', auth: true },
          ]
        : [
            { href: '/login', label: 'Login', auth: true },
            { href: '/register', label: 'Register', auth: true },
            { href: '/admin/login', label: 'Admin Login', auth: true, small: true },
          ]),
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          isMenuOpen ? 'z-[101]' : 'z-50'
        } bg-transparent ${
          isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-4 md:pt-6">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Mobile: Menu Button Left */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onMouseEnter={() => setHoverBurger(true)}
              onMouseLeave={() => setHoverBurger(false)}
              className="md:hidden p-3 -m-3 transition-colors duration-200 text-white"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="w-12 h-10 flex flex-col justify-center items-center gap-0 relative">
                {/* Top line */}
                <span
                  className="block h-[2px] w-full transition-all duration-300 ease-out bg-white"
                  style={{
                    transform: isMenuOpen ? 'rotate(45deg) translateY(0)' : 'translateY(-8px)'
                  }}
                />
                {/* Middle line - small, only visible on hover */}
                <span
                  className={`block h-[2px] w-3/5 transition-all duration-300 ease-out absolute bg-white ${
                    isMenuOpen ? 'opacity-0 scale-x-0' : (hoverBurger ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0')
                  }`}
                />
                {/* Bottom line */}
                <span
                  className="block h-[2px] w-full transition-all duration-300 ease-out bg-white"
                  style={{
                    transform: isMenuOpen ? 'rotate(-45deg) translateY(0)' : 'translateY(8px)'
                  }}
                />
              </div>
            </button>

            {/* Desktop: Logo Left, Mobile: Logo Center */}
            <Link
              href="/"
              prefetch={true}
              className="md:relative absolute left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 flex items-center"
            >
              <img 
                src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770101106/file_0000000073e87208b9708e744f83bf52_gx37wu.png"
                alt="IN-SILK YATRA"
                className="h-20 md:h-24 lg:h-28 w-auto transition-all duration-300"
              />
            </Link>

            {/* Right Side - Menu + Request (Desktop), Request only (Mobile) */}
            <div className="flex items-center gap-8">
              {/* Desktop: Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                onMouseEnter={() => setHoverBurger(true)}
                onMouseLeave={() => setHoverBurger(false)}
                className="hidden md:block p-3 -m-3 transition-colors duration-200 text-white"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <div className="w-14 h-12 flex flex-col justify-center items-center gap-0 relative">
                  {/* Top line */}
                  <span
                    className="block h-[2.5px] w-full transition-all duration-300 ease-out bg-white"
                    style={{
                      transform: isMenuOpen ? 'rotate(45deg) translateY(0)' : 'translateY(-10px)'
                    }}
                  />
                  {/* Middle line - small, only visible on hover */}
                  <span
                    className={`block h-[2.5px] w-3/5 transition-all duration-300 ease-out absolute bg-white ${
                      isMenuOpen ? 'opacity-0 scale-x-0' : (hoverBurger ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0')
                    }`}
                  />
                  {/* Bottom line */}
                  <span
                    className="block h-[2.5px] w-full transition-all duration-300 ease-out bg-white"
                    style={{
                      transform: isMenuOpen ? 'rotate(-45deg) translateY(0)' : 'translateY(10px)'
                    }}
                  />
                </div>
              </button>

              {/* REQUEST Button */}
              <button
                onClick={() => setShowInquiryForm(true)}
                className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#c9b896] hover:bg-[#b8a685] transition-all duration-300 shadow-lg"
              >
                <span className="font-sans text-[9px] md:text-[10px] lg:text-xs tracking-[0.2em] uppercase text-white font-medium">
                  REQUEST
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen menu - slides from bottom */}
      <div
        className={`fixed inset-0 z-[100] pointer-events-none transition-[visibility] duration-500 ${
          isMenuOpen || isClosing ? 'pointer-events-auto visible' : 'invisible'
        }`}
        aria-hidden={!isMenuOpen && !isClosing}
      >
        {/* Menu panel */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isMenuOpen && !isClosing ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ 
            transitionProperty: 'transform',
            transitionDelay: isClosing ? '300ms' : '0ms'
          }}
        >
          {/* Split Layout: Image Left (45%), Content Right (55%) */}
          <div className="flex h-full">
            {/* Left Side - Background Image */}
            <div className="hidden md:block w-[45%] relative">
              <img 
                src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770215115/shavarev-mountains-7230203_1920_oi5hhx.jpg"
                alt="Mountain Landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-stone-900/20" />
            </div>

            {/* Right Side - Dark Background with Content */}
            <div className="w-full md:w-[55%] bg-stone-900 relative">
              {/* Navigation Content */}
              <div className="flex flex-col justify-center min-h-full px-8 md:px-16 lg:px-20 py-16 md:py-20">
                <nav className="space-y-1 md:space-y-1.5 mb-6 md:mb-8">
                  {navContent.map((item, i) => {
                    const delay = 300 + i * 80
                    const baseStyle = {
                      transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease-out',
                      transitionDelay: (isMenuOpen && !isClosing) ? `${delay}ms` : '0ms',
                      transform: (isMenuOpen && !isClosing) ? 'translateX(0)' : 'translateX(-48px)',
                      opacity: (isMenuOpen && !isClosing) ? 1 : 0,
                    }
                    
                    if ('action' in item) {
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            closeMenu()
                            if (item.action === 'logout') handleLogout()
                            if (item.action === 'adminLogout') handleAdminLogout()
                          }}
                          className="block w-full text-left py-1.5 md:py-2 text-base md:text-lg font-serif font-light text-white/90 hover:text-white transition-colors"
                          style={baseStyle}
                        >
                          {item.label}
                        </button>
                      )
                    }
                    
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        prefetch={true}
                        onClick={closeMenu}
                        className={`block py-1.5 md:py-2 font-serif font-light text-white/90 hover:text-white transition-colors ${
                          'small' in item && item.small 
                            ? 'text-sm text-white/60' 
                            : 'text-base md:text-lg'
                        }`}
                        style={baseStyle}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                {/* Contact Info */}
                <div 
                  className="pt-4 md:pt-6 border-t border-white/20"
                  style={{
                    transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease-out',
                    transitionDelay: (isMenuOpen && !isClosing) ? `${300 + navContent.length * 80}ms` : '0ms',
                    transform: (isMenuOpen && !isClosing) ? 'translateX(0)' : 'translateX(-48px)',
                    opacity: (isMenuOpen && !isClosing) ? 1 : 0,
                  }}
                >
                  <a href="tel:+77074227482" className="block text-white/70 hover:text-white text-sm md:text-base mb-1.5 font-sans tracking-wider transition-colors">
                    T. +7 707 422 7482
                  </a>
                  <a href="mailto:insilkyatradmc@gmail.com" className="block text-white/70 hover:text-white text-sm md:text-base mb-3 font-sans tracking-wider transition-colors">
                    E. insilkyatradmc@gmail.com
                  </a>
                  
                  {/* Social Media Links */}
                  <div className="flex gap-4 mt-2">
                    <a 
                      href="https://www.facebook.com/profile.php?id=61587158278146"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c9b896] hover:text-white text-sm font-sans tracking-wider transition-colors"
                    >
                      Facebook
                    </a>
                    <a 
                      href="https://www.instagram.com/insilkyatradmc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c9b896] hover:text-white text-sm font-sans tracking-wider transition-colors"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form Modal */}
      <MultiStepInquiryForm 
        isOpen={showInquiryForm} 
        onClose={() => setShowInquiryForm(false)} 
      />
    </>
  )
}
