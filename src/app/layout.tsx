import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AOSProvider from '@/components/AOSProvider'
import StructuredData from '@/components/StructuredData'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'WISE Institute - Western Implant and Surgical Excellence',
    template: '%s | WISE Institute',
  },
  description: 'Comprehensive hands-on implant dentistry training for general dentists. 8-day residency programs with live surgery, mentorship from Dr. Chris Lee and Dr. Stephen Yoon.',
  keywords: [
    'implant dentistry',
    'dental education',
    'implant training',
    'dental residency',
    'live surgery',
    'dental CE credits',
    'implant dentistry courses',
    'general dentist training',
    'WISE Institute',
    'Vancouver dental education',
  ],
  authors: [{ name: 'WISE Institute' }],
  creator: 'WISE Institute',
  publisher: 'WISE Institute',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: baseUrl,
    siteName: 'WISE Institute',
    title: 'WISE Institute - Western Implant and Surgical Excellence',
    description: 'Comprehensive hands-on implant dentistry training for general dentists. 8-day residency programs with live surgery.',
    images: [
      {
        url: '/gallery/wise.webp',
        width: 1200,
        height: 630,
        alt: 'WISE Institute - Implant Dentistry Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WISE Institute - Western Implant and Surgical Excellence',
    description: 'Comprehensive hands-on implant dentistry training for general dentists.',
    images: ['/gallery/wise.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: 'your-google-verification-code',
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <StructuredData />
      </head>
      <body className="font-pretendard w-full overflow-x-hidden">
        <GoogleAnalytics />
        <AOSProvider>
          <Navbar />
          <main className="w-full overflow-visible">
            {children}
          </main>
          <Footer />
        </AOSProvider>
      </body>
    </html>
  )
}
