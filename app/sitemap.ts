import { MetadataRoute } from 'next';

const BASE_URL = 'https://your-domain.vercel.app'; // 배포 후 실제 도메인으로 교체

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
