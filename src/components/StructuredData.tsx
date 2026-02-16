export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'WISE Institute',
    alternateName: 'Western Implant and Surgical Excellence',
    url: baseUrl,
    logo: `${baseUrl}/favicon.png`,
    description: 'Comprehensive hands-on implant dentistry training for general dentists. 8-day residency programs with live surgery, mentorship from Dr. Chris Lee and Dr. Stephen Yoon.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vancouver',
      addressRegion: 'BC',
      addressCountry: 'CA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@wiseinstitute.com',
      contactType: 'Customer Service',
    },
    sameAs: [
      // Add social media links when available
      // 'https://www.facebook.com/wiseinstitute',
       'https://www.instagram.com/wise_institute',
    ],
  };

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Foundations of Implant Dentistry',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'WISE Institute',
    },
    description: 'Comprehensive 8-day implant residency program with live surgery, hands-on training, and mentorship. 56 CE Credits.',
    educationalCredentialAwarded: 'CE Credits',
    numberOfCredits: 56,
    courseCode: 'WISE-IMPLANT-2026',
    offers: {
      '@type': 'Offer',
      price: '7500-9500',
      priceCurrency: 'CAD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
    </>
  );
}
