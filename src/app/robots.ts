import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.red-flagged.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/employer/dashboard',
          '/candidate/dashboard',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}


