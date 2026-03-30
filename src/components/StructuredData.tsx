import { getPrograms } from '@/lib/programs';

function toISODate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function extractFirstNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

export default async function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';
  const programs = await getPrograms().catch(() => []);

  // Vancouver placeholder coordinates for local SEO / geo tags.
  const vancouverGeo = {
    '@type': 'GeoCoordinates',
    latitude: 49.2827,
    longitude: -123.1207,
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'WISE Institute',
    alternateName: 'Western Implant and Surgical Excellence',
    url: baseUrl,
    logo: `${baseUrl}/favicon.png`,
    description:
      'Comprehensive hands-on implant dentistry training for general dentists. 8-day residency programs with live surgery, mentorship from Dr. Lee and Dr. Yoon.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vancouver',
      addressRegion: 'BC',
      addressCountry: 'CA',
      geo: vancouverGeo,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@wiseinstitute.com',
      contactType: 'Customer Service',
    },
    sameAs: ['https://www.instagram.com/wise_institute'],
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'WISE Institute',
    url: baseUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vancouver',
      addressRegion: 'BC',
      addressCountry: 'CA',
      geo: vancouverGeo,
    },
    email: 'info@wiseinstitute.com',
  };

  const events = programs.map((p) => {
    const startDate = toISODate(p.startDate);
    const endDate = toISODate(p.endDate ?? p.startDate);
    const eventStatus =
      p.status === 'Completed'
        ? 'https://schema.org/EventCancelled'
        : 'https://schema.org/EventScheduled';

    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: p.title,
      description: p.description,
      startDate,
      ...(endDate ? { endDate } : {}),
      eventStatus,
      organizer: {
        '@type': 'EducationalOrganization',
        name: 'WISE Institute',
        url: baseUrl,
      },
      location: p.location
        ? {
            '@type': 'Place',
            name: p.location,
          }
        : undefined,
    };
  });

  const courses = programs
    .filter((p) => p.type === 'Residency' && p.ceCredits)
    .map((p) => {
      const credits = extractFirstNumber(p.ceCredits);
      return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: p.title,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'WISE Institute',
          url: baseUrl,
        },
        description: p.description,
        educationalCredentialAwarded: 'CE Credits',
        ...(credits ? { numberOfCredits: credits } : {}),
        offers: p.price
          ? {
              '@type': 'Offer',
              price: p.price,
              priceCurrency: 'CAD',
            }
          : undefined,
      };
    });

  const graph = [
    organizationSchema,
    localBusinessSchema,
    ...events,
    // Keep Course schema only for Residency with CE Credits.
    ...courses,
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}
