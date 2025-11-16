import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AOSProvider from '@/components/AOSProvider'
import { Inter } from 'next/font/google'

const headingFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-heading',
})

export const metadata = {
  title: 'WISE Institute - Western Implant and Surgical Excellence',
  description: 'Advancing Dental Education Through Hands-On Experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={headingFont.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preload" href="/fonts/Pretendard.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="font-pretendard w-full overflow-x-hidden">
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
