import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Stay updated with the latest news, announcements, and highlights from WISE Institute. Program updates, event highlights, and institute news.',
  openGraph: {
    title: 'WISE Institute News & Updates',
    description: 'Latest news, announcements, and highlights from WISE Institute.',
    url: `${baseUrl}/news`,
  },
  twitter: {
    card: 'summary',
    title: 'WISE Institute News & Updates',
    description: 'Latest news and announcements from WISE Institute.',
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
