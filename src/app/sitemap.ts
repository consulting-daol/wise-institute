import { MetadataRoute } from 'next';
import { getNewsItems } from '@/lib/news';
import { getPrograms } from '@/lib/programs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

  let programsLastModified: Date = new Date();
  try {
    const programs = await getPrograms();
    // Use the latest program startDate as the best-effort lastModified for schedule-related pages.
    const latest = programs
      .map((p) => new Date(p.startDate))
      .filter((d) => !Number.isNaN(d.getTime()))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    if (latest) programsLastModified = latest;
  } catch (error) {
    console.error('Error fetching programs for sitemap:', error);
  }

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: programsLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: programsLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: programsLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/directors`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Dynamic news routes
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const newsItems = await getNewsItems();
    newsRoutes = newsItems.map((item) => ({
      url: `${baseUrl}/news/${item.id}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching news items for sitemap:', error);
    // Continue without news routes if fetch fails
  }

  return [...staticRoutes, ...newsRoutes];
}
