import { getPrograms } from '@/lib/programs';

/** US-style dates from CMS, e.g. "April 11, 2026" → ISO 8601 date (YYYY-MM-DD). */
const MONTH_INDEX: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

/**
 * Returns ISO 8601 date string (YYYY-MM-DD) or full datetime in UTC.
 * Google Search accepts YYYY-MM-DD for all-day events.
 */
function toIso8601DateTime(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();

  const usMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (usMatch) {
    const month = MONTH_INDEX[usMatch[1].toLowerCase()];
    if (month === undefined) return undefined;
    const day = Number(usMatch[2]);
    const year = Number(usMatch[3]);
    if (!day || !year) return undefined;
    const d = new Date(Date.UTC(year, month, day));
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString().slice(0, 10);
  }

  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function extractFirstNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

/** Rough CAD price for Offer.price (digits only); omit if unknown. */
function extractOfferPriceCad(price: string | undefined): string | undefined {
  if (!price?.trim()) return undefined;
  const lower = price.toLowerCase();
  if (/\bfree\b/i.test(lower)) return '0';
  const nums = price.match(/\d[\d,]*/g);
  if (!nums?.length) return undefined;
  const first = nums[0].replace(/,/g, '');
  const n = Number(first);
  return Number.isFinite(n) ? String(n) : undefined;
}

/**
 * Event location with PostalAddress (required by Google Event rich results).
 * Parses common BC address lines from program copy.
 */
function buildEventPlace(location: string): {
  '@type': 'Place';
  name: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
} {
  const trimmed = location.trim();
  if (!trimmed) {
    return {
      '@type': 'Place',
      name: 'WISE Institute',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Vancouver',
        addressRegion: 'BC',
        addressCountry: 'CA',
      },
    };
  }

  if (!trimmed.includes(',')) {
    const lower = trimmed.toLowerCase();
    const locality = lower.includes('coquitlam')
      ? 'Coquitlam'
      : lower.includes('burnaby')
        ? 'Burnaby'
        : 'Vancouver';
    return {
      '@type': 'Place',
      name: trimmed,
      address: {
        '@type': 'PostalAddress',
        streetAddress: trimmed,
        addressLocality: locality,
        addressRegion: 'BC',
        addressCountry: 'CA',
      },
    };
  }

  const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 3) {
    const region = parts[parts.length - 1];
    const locality = parts[parts.length - 2];
    const streetAndVenue = parts.slice(0, -2).join(', ');
    if (/^[A-Z]{2}$/i.test(region)) {
      return {
        '@type': 'Place',
        name: parts[0] || trimmed,
        address: {
          '@type': 'PostalAddress',
          streetAddress: streetAndVenue || undefined,
          addressLocality: locality,
          addressRegion: region.toUpperCase(),
          addressCountry: 'CA',
        },
      };
    }
  }

  return {
    '@type': 'Place',
    name: trimmed,
    address: {
      '@type': 'PostalAddress',
      streetAddress: trimmed,
      addressLocality: 'Vancouver',
      addressRegion: 'BC',
      addressCountry: 'CA',
    },
  };
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

  const defaultEventImage = `${baseUrl}/gallery/wise.webp`;

  const events = programs
    .map((p) => {
      const startDate = toIso8601DateTime(p.startDate);
      if (!startDate) return null;

      let endDate = toIso8601DateTime(p.endDate ?? p.startDate) ?? startDate;
      const startMs = Date.parse(startDate);
      const endMs = Date.parse(endDate);
      if (!Number.isNaN(startMs) && !Number.isNaN(endMs) && endMs < startMs) {
        endDate = startDate;
      }

      const offerPrice = extractOfferPriceCad(p.price);

      return {
        '@type': 'Event',
        name: p.title,
        description: p.description,
        startDate,
        endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        image: [defaultEventImage],
        offers: {
          '@type': 'Offer',
          url: `${baseUrl}/schedule`,
          priceCurrency: 'CAD',
          price: offerPrice ?? '0',
          availability: 'https://schema.org/InStock',
        },
        performer: {
          '@type': 'Organization',
          name: 'WISE Institute',
          url: baseUrl,
        },
        organizer: {
          '@type': 'EducationalOrganization',
          name: 'WISE Institute',
          url: baseUrl,
        },
        location: buildEventPlace(p.location || ''),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const courses = programs
    .filter((p) => p.type === 'Residency' && p.ceCredits)
    .map((p) => {
      const credits = extractFirstNumber(p.ceCredits);
      return {
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
