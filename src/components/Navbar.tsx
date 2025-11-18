'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, Instagram } from 'lucide-react'
import Logo from './Logo'

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
    ],
  },
  { 
    name: 'Resources', 
    href: '/programs',
    megaMenu: [
      { name: 'Residency Highlights', href: '/programs' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'News', href: '/news' },
    ]
  },
  { name: 'Registration', href: '/schedule' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
                    <ul className="space-y-1">
                      {item.megaMenu?.map((menuItem) => (
                        <li key={menuItem.name}>
                          <Link
                            href={menuItem.href}
                            className="block px-4 py-2.5 text-base text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          >
                            {menuItem.name}
                          </Link>
                        </li>
                      ))}
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
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-[998] overflow-y-auto">
          {/* Header Section with Instagram and View Schedule */}
          <div className="border-b border-secondary-200">
            <div className="flex items-stretch h-14">
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
          <div className="px-4 sm:px-6 py-6 space-y-8">
            {/* Programs Section */}
            <div>
              <h2 className="text-lg font-bold text-secondary-900 mb-3">Programs</h2>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/programs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  Program Overview
                </Link>
                <Link
                  href="/programs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  Hands-on Learning
                </Link>
                <Link
                  href="/schedule"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  Course Structure
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  Support & Resources
                </Link>
              </div>
            </div>

            {/* About Us Section */}
            <div>
              <h2 className="text-lg font-bold text-secondary-900 mb-3">About Us</h2>
              <div className="space-y-1">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/directors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  Our Directors
                </Link>
              </div>
            </div>

            {/* Resources Section */}
            <div>
              <h2 className="text-lg font-bold text-secondary-900 mb-3">Resources</h2>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/programs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  Residency Highlights
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/news"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  News
                </Link>
              </div>
            </div>

            {/* Registration Section */}
            <div>
              <h2 className="text-lg font-bold text-secondary-900 mb-3">Registration</h2>
              <div className="space-y-1">
                <Link
                  href="/schedule"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  Upcoming Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
