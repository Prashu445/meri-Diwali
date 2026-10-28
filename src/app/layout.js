// src/app/layout.jsx
import './globals.css';

export const metadata = {
  title: 'Meri Diwali 3D | Virtual Mohalla',
  description: 'Ek shaandaar 3D Virtual Diwali experience. Patake phodiye, puja karein, aur parivaar ke sath tyohar manayein!',
  verification: {
    google: '<meta name="google-site-verification" content="kdg6kaYCZFQOZswrj2TClcak4ZpoyoNP0kqNG7zphxs" />'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <meta name="theme-color" content="#070510" />
      </head>
      <body className="antialiased bg-[#070510] text-amber-50 overflow-hidden">
        {children}
      </body>
    </html>
  );
}