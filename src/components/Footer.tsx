import Link from 'next/link'
import Logo from './Logo'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-secondary-200">
      <div className="container-custom py-4 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="space-y-1.5 md:space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Logo size="sm" className="md:hidden" />
              <Logo size="md" className="hidden md:block" />
            </div>
            <p className="text-xs md:text-sm text-secondary-600 leading-relaxed">
              Hands-on implant education for general dentists across Western Canada.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-1.5 md:space-y-4 text-center md:text-left">
            <h3 className="text-xs md:text-sm font-bold text-secondary-900 uppercase tracking-wider">Contact</h3>
            <div className="space-y-1 md:space-y-3 flex flex-col items-center md:items-start">
              <div className="flex items-start space-x-2 md:space-x-3">
                <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-secondary-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs md:text-sm text-secondary-600">info@wiseinstitute.com</span>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-secondary-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs md:text-sm text-secondary-600">(604) 555-0123</span>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-secondary-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs md:text-sm text-secondary-600">Western Canada</span>
              </div>
            </div>
          </div>

          {/* Additional Info - Hidden on mobile */}
          <div className="hidden md:block space-y-2 md:space-y-4 text-center md:text-left">
            <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-wider">About</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">
              WISE Institute provides comprehensive implant education with hands-on training and live surgery sessions.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-200 mt-4 md:mt-12 pt-3 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <p className="text-xs md:text-sm text-secondary-500">
              © {new Date().getFullYear()} WISE Institute. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 md:space-x-6 text-xs md:text-sm text-secondary-500">
              <Link href="/contact" className="hover:text-primary-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-primary-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
