import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'View photos and videos from WISE Institute programs, live surgery sessions, hands-on training, and community moments.',
  openGraph: {
    title: 'WISE Institute Gallery',
    description: 'Photos and videos from our implant dentistry training programs and live surgery sessions.',
    url: `${baseUrl}/gallery`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WISE Institute Gallery',
    description: 'Photos and videos from our implant dentistry training programs.',
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gallery',
        item: `${baseUrl}/gallery`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
