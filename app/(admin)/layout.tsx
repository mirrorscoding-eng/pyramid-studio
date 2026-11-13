import type { Metadata } from 'next';
import './dashboard.css';

export const metadata: Metadata = {
  title: 'لوحة التحكم · هرم',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon-dark.svg' }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Markazi+Text:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
