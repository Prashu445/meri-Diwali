// src/app/sitemap.js
export default function sitemap() {
  return [
    {
      url: 'https://meri-diwali.vercel.app/', // 👈 Yahan apna asli Vercel link daalein
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ];
}