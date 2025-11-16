import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  variant?: 'default' | 'white'
}

export default function Logo({ className = '', size = 'md', showTagline = false, variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-16'
  }

  const taglineSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const colorClasses = {
    default: {
      tagline: 'text-primary-600'
    },
    white: {
      tagline: 'text-white/80'
    }
  }

  const colors = colorClasses[variant]
  const logoSrc = variant === 'white' ? '/logo/Transparent-PNG-White.png' : '/logo/Transparent-inlinePNG.png'

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} flex items-center justify-center w-auto`}>
        <Image
          src={logoSrc}
          alt="WISE Institute Logo"
          width={200}
          height={200}
          quality={100}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
    </div>
  )
}
