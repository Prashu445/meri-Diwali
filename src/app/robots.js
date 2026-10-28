// src/app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://meri-diwali.vercel.app/', // 👈 Yahan apna asli link daalein
  };
}