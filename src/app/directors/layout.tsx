import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

export const metadata: Metadata = {
  title: 'Our Directors',
  description: 'Meet Dr. Chris Lee and Dr. Stephen Yoon, directors of WISE Institute. Learn about their expertise in implant dentistry and commitment to hands-on education.',
  keywords: [
    'Dr. Chris Lee',
    'Dr. Stephen Yoon',
    'implant dentistry experts',
    'dental education directors',
    'WISE Institute directors',
  ],
  openGraph: {
    title: 'WISE Institute Directors - Dr. Chris Lee & Dr. Stephen Yoon',
    description: 'Meet the directors of WISE Institute and learn about their expertise in implant dentistry education.',
    url: `${baseUrl}/directors`,
  },
  twitter: {
    card: 'summary',
    title: 'WISE Institute Directors',
    description: 'Meet the directors of WISE Institute.',
  },
};

export default function DirectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
