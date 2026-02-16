import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

export const metadata: Metadata = {
  title: 'Schedule & Registration',
  description: 'View upcoming WISE Institute program dates and register your interest. Spring 2026 cohort starting April 11, 2026. Limited seats available.',
  keywords: [
    'implant dentistry schedule',
    'dental program dates',
    'register for implant course',
    'WISE Institute registration',
    'dental CE course schedule',
  ],
  openGraph: {
    title: 'WISE Institute Schedule & Registration',
    description: 'View upcoming program dates and register your interest. Spring 2026 cohort starting April 11, 2026.',
    url: `${baseUrl}/schedule`,
  },
  twitter: {
    card: 'summary',
    title: 'WISE Institute Schedule & Registration',
    description: 'View upcoming program dates and register your interest.',
  },
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
