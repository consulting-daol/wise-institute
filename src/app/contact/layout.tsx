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
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What experience level is required for your programs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Our programs are designed for general dentists with varying levels of implant experience. We welcome beginners who have placed 0-5 implants, intermediate practitioners (5-50 implants), and advanced clinicians (50+ implants) looking to refine their skills.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to bring my own patients for the Live Surgery Study Club?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Yes, for the Live Surgery Study Club, participants are encouraged to bring their own patients. This allows you to work on cases that are relevant to your practice while receiving direct mentorship from our experienced directors.',
        },
      },
      {
        '@type': 'Question',
        name: 'What materials are included in the program fees?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'The Implant Residency program includes comprehensive printed course notes, all hands-on training materials, and access to our online resources. All surgical instruments and materials for hands-on practice are provided.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I register for upcoming programs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            "You can register your interest using the form on our Schedule page, or contact us directly via email or phone. We'll provide you with detailed program information and registration instructions.",
        },
      },
      {
        '@type': 'Question',
        name: 'What is the cancellation policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            "We understand that schedules can change. Please contact us as soon as possible if you need to cancel or reschedule. We'll work with you to find the best solution, including transferring to a future program.",
        },
      },
    ],
  };

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
        name: 'Contact',
        item: `${baseUrl}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
