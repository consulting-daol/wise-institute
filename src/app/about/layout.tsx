import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about WISE Institute, our mission to provide hands-on implant dentistry education, and our commitment to training general dentists in surgical excellence.',
  openGraph: {
    title: 'About WISE Institute',
    description: 'Learn about WISE Institute and our mission to provide hands-on implant dentistry education.',
    url: `${baseUrl}/about`,
    images: ['/gallery/about1.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About WISE Institute',
    description: 'Learn about WISE Institute and our mission to provide hands-on implant dentistry education.',
  },
};

export default function AboutLayout({
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
        name: 'About',
        item: `${baseUrl}/about`,
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
