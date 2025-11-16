'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'
import Logo from './Logo'

const navigation = [
  { name: 'News', href: '/news' },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Directors', href: '/directors' },
    ],
  },
  { name: 'Upcoming Courses', href: '/schedule' },
  { name: 'Contact Us', href: '/contact' },
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
    <nav className={`fixed top-0 w-full z-[999] transition-all duration-300 bg-white ${
      scrolled ? 'shadow-sm' : ''
    }`}>
      <div className="flex items-stretch h-16 lg:h-20 justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center pl-4 sm:pl-5 lg:pl-6 flex-shrink-0">
          <h1 className="logo flex items-center">
            <Link href="/" className="flex items-center">
              {/* Smaller logo on mobile, larger on desktop */}
              <div className="lg:hidden">
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
        <nav className="gnb hidden lg:flex items-center flex-1 justify-center">
          <ul className="flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <li key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-secondary-900 font-semibold text-xl hover:text-primary-600 transition-colors inline-flex items-center gap-1"
                >
                  {item.name}
                </Link>

                {item.children && (
                  <div className="pointer-events-none absolute left-0 top-full w-56 rounded-2xl border border-secondary-100 bg-white shadow-soft opacity-0 translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 transition-all duration-200 ease-out">
                    <ul className="py-3">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.href}
                            className="block px-5 py-2.5 text-base text-secondary-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section - ENG and CTA Button */}
        <aside className="flex items-stretch flex-shrink-0">
          {/* ENG Link */}
          <div className="side-link hidden lg:flex items-center px-4 lg:px-6">
            <Link
              href="/en"
              className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              ENG
            </Link>
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
          <div className="gnb-open lg:hidden flex items-center pr-4 sm:pr-5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative text-secondary-700 hover:text-primary-600 transition-colors p-4 w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {/* Hamburger Menu Icon */}
              <Menu 
                className={`h-6 w-6 absolute transition-all duration-300 ease-in-out ${
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
          </div>
        </aside>
      </div>

      {/* Mobile Navigation - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-[998] overflow-y-auto">
          {/* Header Section with ENG and View Schedule */}
          <div className="border-b border-secondary-200">
            <div className="flex items-stretch h-14">
              {/* ENG Link */}
              <div className="flex items-center px-4 sm:px-6">
                <Link
                  href="/en"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors font-medium"
                >
                  ENG
                </Link>
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
