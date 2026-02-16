import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with WISE Institute. Contact us for program inquiries, registration details, or questions about our implant dentistry training programs.',
  keywords: [
    'contact WISE Institute',
    'dental education inquiry',
    'implant course contact',
    'WISE Institute email',
  ],
  openGraph: {
    title: 'Contact WISE Institute',
    description: 'Get in touch with WISE Institute for program inquiries and registration details.',
    url: `${baseUrl}/contact`,
  },
  twitter: {
    card: 'summary',
    title: 'Contact WISE Institute',
    description: 'Get in touch with WISE Institute for program inquiries.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
