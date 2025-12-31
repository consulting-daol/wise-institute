'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ArrowRight, Instagram, LogOut, Shield } from 'lucide-react'
import Logo from './Logo'
import { checkAdminSession } from '@/lib/admin'

const navigation = [
  { 
    name: 'Programs', 
    href: '/programs',
    megaMenu: [
      { name: 'Program Overview', href: '/programs' },
      { name: 'Course Structure', href: '/schedule' },
      { name: 'Support & Resources', href: '/contact' },
    ]
  },
  {
    name: 'About',
    href: '/about',
    megaMenu: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Directors', href: '/directors' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  { 
    name: 'Resources', 
    href: '/programs',
    megaMenu: [
      { name: 'Residency Highlights', href: '/programs' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'News', href: '/news' },
      { name: 'Admin', href: '/login', adminOnly: false },
    ]
  },
  { name: 'Registration', href: '/schedule' },
]

export default function Navbar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await checkAdminSession()
      setIsAdmin(adminStatus)
    }
    checkAdmin()
    
    // 주기적으로 체크 (세션 만료 감지)
    const interval = setInterval(checkAdmin, 60000) // 1분마다 체크
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setIsAdmin(false)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className={`fixed top-0 w-full z-[99999] transition-all duration-300 bg-white ${
      scrolled ? 'shadow-sm' : ''
    }`}>
      <div className="flex items-stretch h-16 lg:h-20 w-full">
        {/* Left Section - Logo */}
        <div className="flex items-center pl-3 sm:pl-4 lg:pl-6 flex-shrink-0 overflow-hidden">
          <h1 className="logo flex items-center overflow-hidden">
            <Link href="/" className="flex items-center overflow-hidden">
              {/* Smaller logo on mobile, larger on desktop */}
              <div className="lg:hidden flex-shrink-0 max-w-[200px] sm:max-w-[200px]">
                <Logo size="sm" />
              </div>
              <div className="hidden lg:block">
                <Logo size="lg" />
              </div>
            </Link>
            <Link href="#main-content" className="sr-only">
              Skip to main content
            </Link>
          </h1>
        </div>

        {/* Navigation Links - Center */}
        <nav className="gnb hidden lg:flex items-center flex-1 justify-center min-w-0 group/nav">
          <ul className="flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <li key={item.name} className="relative">
                <Link
                  href={item.href}
                  className="text-secondary-900 font-semibold text-xl hover:text-primary-600 transition-colors inline-flex items-center gap-1"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Combined Mega Menu - Shows all items when hovering over nav */}
          <div className="fixed left-0 right-0 top-20 w-full bg-white border-t border-secondary-200 shadow-xl opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 ease-out pointer-events-none group-hover/nav:pointer-events-auto" style={{ zIndex: 100000 }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              <div className="grid grid-cols-5 gap-8">
                {/* Empty column for symmetry */}
                <div className="col-span-1"></div>
                
                {/* Mega Menu Items - Centered */}
                {navigation.filter(item => item.megaMenu).map((item) => (
                  <div key={item.name} className="col-span-1">
                    <h3 className="text-lg font-bold text-secondary-900 mb-4">{item.name}</h3>
                    <ul className="space-y-0 flex flex-col">
                      {item.megaMenu?.map((menuItem) => {
                        // Admin 링크는 로그인 상태에 따라 텍스트 변경
                        const isAdminLink = menuItem.name === 'Admin';
                        const displayText = isAdminLink && isAdmin ? 'Admin Panel' : menuItem.name;
                        const adminHref = isAdminLink && isAdmin ? '/admin' : menuItem.href;
                        
                        return (
                          <li key={menuItem.name} className="w-full">
                            <Link
                              href={adminHref}
                              className={`block w-full px-0 py-2.5 text-base rounded transition-colors text-left ${
                                isAdminLink && isAdmin
                                  ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-semibold'
                                  : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                              }`}
                            >
                              {displayText}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                
                {/* Empty column for symmetry */}
                <div className="col-span-1"></div>
              </div>
            </div>
          </div>
        </nav>

        {/* Right Section - Instagram Link and CTA Button */}
        <aside className="flex items-stretch ml-auto flex-shrink-0">
          {/* Admin Status Indicator - Desktop */}
          {isAdmin && (
            <div className="hidden lg:flex items-center px-3 gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Instagram Link */}
          <div className="side-link hidden lg:flex items-center px-4 lg:px-6">
            <a
              href="https://www.instagram.com/wise_institute"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-600 hover:text-primary-600 transition-colors"
              aria-label="Visit WISE Institute Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* CTA Button - Full Height, Extends to Right Edge - Hidden on mobile */}
          <Link
            href="/schedule"
            className="donate-link hidden lg:flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 lg:px-8 font-semibold transition-colors text-sm lg:text-base self-stretch"
          >
            <span>View Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mobile menu button - Right edge on mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative text-secondary-700 hover:text-primary-600 transition-colors p-2 mr-3 sm:mr-4 flex items-center justify-center flex-shrink-0"
            aria-label="Toggle menu"
          >
            {/* Hamburger Menu Icon */}
            <Menu 
              className={`h-6 w-6 transition-all duration-300 ease-in-out ${
                mobileMenuOpen 
                  ? 'opacity-0 rotate-90 scale-0' 
                  : 'opacity-100 rotate-0 scale-100'
              }`} 
            />
            {/* X Icon */}
            <X 
              className={`h-6 w-6 absolute transition-all duration-300 ease-in-out ${
                mobileMenuOpen 
                  ? 'opacity-100 rotate-0 scale-100' 
                  : 'opacity-0 -rotate-90 scale-0'
              }`} 
            />
          </button>
        </aside>
      </div>

      {/* Mobile Navigation - Full Screen Overlay */}
      <div className={`lg:hidden fixed inset-0 top-16 bg-white z-[998] overflow-y-auto transition-all duration-300 ease-out origin-top-right ${
        mobileMenuOpen 
          ? 'opacity-100 scale-100 visible' 
          : 'opacity-0 scale-95 invisible pointer-events-none'
      }`}>
        {/* Header Section with Instagram and View Schedule */}
        <div className={`border-b border-secondary-200 transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        }`} style={{ transitionDelay: mobileMenuOpen ? '50ms' : '0ms' }}>
            <div className="flex items-stretch h-14">
              {/* Admin Status Indicator - Mobile */}
              {isAdmin && (
                <div className="flex items-center px-3 gap-2 border-r border-secondary-200">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded">
                    <Shield className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Admin</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="p-1.5 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Instagram Link */}
              <div className="flex items-center px-4 sm:px-6">
                <a
                  href="https://www.instagram.com/wise_institute"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
                  aria-label="Visit WISE Institute Instagram"
                >
              <Instagram className="w-5 h-5" />
              <span className="text-sm font-medium">Follow Us</span>
                </a>
              </div>
              
              {/* View Schedule Button - Full Height, Extends to Right Edge */}
              <Link
                href="/schedule"
                onClick={() => setMobileMenuOpen(false)}
                className="ml-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 font-semibold transition-colors text-sm self-stretch"
              >
                <span>View Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Main Menu Sections */}
          <div className={`px-4 sm:px-6 py-6 space-y-8 transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
          }`} style={{ transitionDelay: mobileMenuOpen ? '100ms' : '0ms' }}>
            {/* Programs Section */}
            <div className={`transition-all duration-300 ease-out ${
              mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
            }`} style={{ transitionDelay: mobileMenuOpen ? '150ms' : '0ms' }}>
              <h2 className="text-lg font-bold text-secondary-900 mb-3">Programs</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/programs', label: 'Program Overview' },
                  { href: '/programs', label: 'Hands-on Learning' },
                  { href: '/schedule', label: 'Course Structure' },
                  { href: '/contact', label: 'Support & Resources' },
                ].map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-all duration-300 ease-out ${
                      mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                    }`}
                    style={{ transitionDelay: mobileMenuOpen ? `${200 + index * 50}ms` : '0ms' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* About Us Section */}
            <div className={`transition-all duration-300 ease-out ${
              mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
            }`} style={{ transitionDelay: mobileMenuOpen ? '400ms' : '0ms' }}>
              <h2 className="text-lg font-bold text-secondary-900 mb-3">About Us</h2>
              <div className="space-y-1">
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/directors', label: 'Our Directors' },
                  { href: '/contact', label: 'Contact Us' },
                ].map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-all duration-300 ease-out ${
                      mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                    }`}
                    style={{ transitionDelay: mobileMenuOpen ? `${450 + index * 50}ms` : '0ms' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div className={`transition-all duration-300 ease-out ${
              mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
            }`} style={{ transitionDelay: mobileMenuOpen ? '600ms' : '0ms' }}>
              <h2 className="text-lg font-bold text-secondary-900 mb-3">Resources</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/programs', label: 'Residency Highlights' },
                  { href: '/gallery', label: 'Gallery' },
                  { href: '/news', label: 'News' },
                  { href: isAdmin ? '/admin' : '/login', label: isAdmin ? 'Admin Panel' : 'Admin', isAdmin },
                ].map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm rounded transition-all duration-300 ease-out ${
                      item.isAdmin
                        ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-semibold'
                        : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                    } ${
                      mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                    }`}
                    style={{ transitionDelay: mobileMenuOpen ? `${650 + index * 50}ms` : '0ms' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Registration Section */}
            <div className={`transition-all duration-300 ease-out ${
              mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
            }`} style={{ transitionDelay: mobileMenuOpen ? '850ms' : '0ms' }}>
              <h2 className="text-lg font-bold text-secondary-900 mb-3">Registration</h2>
              <div className="space-y-1">
                <Link
                  href="/schedule"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-all duration-300 ease-out ${
                    mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                  }`}
                  style={{ transitionDelay: mobileMenuOpen ? '900ms' : '0ms' }}
                >
                  Upcoming Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
    </nav>
  )
}
