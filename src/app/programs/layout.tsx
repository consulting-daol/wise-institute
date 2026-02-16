import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

export const metadata: Metadata = {
  title: 'Our Programs',
  description: 'Comprehensive 8-day implant residency program with live surgery, hands-on training, and mentorship. 56 CE Credits. Designed for general dentists seeking surgical excellence.',
  keywords: [
    'implant residency program',
    'dental CE credits',
    'live surgery training',
    'implant dentistry course',
    'hands-on dental training',
    '8-day implant program',
  ],
  openGraph: {
    title: 'WISE Institute Programs - Implant Residency Training',
    description: 'Comprehensive 8-day implant residency program with live surgery and hands-on training. 56 CE Credits.',
    url: `${baseUrl}/programs`,
    images: ['/gallery/WISE.005.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WISE Institute Programs',
    description: 'Comprehensive 8-day implant residency program with live surgery and hands-on training.',
  },
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
