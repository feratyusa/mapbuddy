import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://simfas-joker.site';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/convert'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
