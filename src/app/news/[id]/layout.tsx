import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wiseinstitute.com';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // Try to fetch news item for dynamic metadata
  try {
    const response = await fetch(`${baseUrl}/api/news`, { next: { revalidate: 60 } });
    if (response.ok) {
      const newsItems = await response.json();
      const newsItem = newsItems.find((item: { id: string }) => item.id === params.id);
      if (newsItem) {
        return {
          title: newsItem.title,
          description: newsItem.description || 'Read the latest news from WISE Institute.',
          openGraph: {
            title: newsItem.title,
            description: newsItem.description || 'Read the latest news from WISE Institute.',
            url: `${baseUrl}/news/${params.id}`,
            images: newsItem.image ? [newsItem.image] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title: newsItem.title,
            description: newsItem.description || 'Read the latest news from WISE Institute.',
          },
        };
      }
    }
  } catch {
    // Fallback to default metadata
  }

  return {
    title: 'News Article',
    description: 'Read the latest news from WISE Institute.',
  };
}

export default function NewsDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
