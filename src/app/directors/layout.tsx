import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

export const metadata: Metadata = {
  title: 'Our Directors',
  description: 'Meet Dr. Lee and Dr. Yoon, directors of WISE Institute. Learn about their expertise in implant dentistry and commitment to hands-on education.',
  keywords: [
    'Dr. Lee',
    'Dr. Yoon',
    'implant dentistry experts',
    'dental education directors',
    'WISE Institute directors',
  ],
  openGraph: {
    title: 'WISE Institute Directors - Dr. Lee & Dr. Yoon',
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
        name: 'Directors',
        item: `${baseUrl}/directors`,
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
