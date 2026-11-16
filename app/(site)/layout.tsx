import type { Metadata } from 'next';
import { logoSVG } from '@/lib/art';
import { getContent, getLang, makeT } from '@/lib/content/server';
import { Header } from '@/components/site/Header';
import { SiteClient } from '@/components/site/SiteClient';
import { Footer, NAV } from '@/components/site/blocks';
import './site.css';

// Absolute base for og:image and other share links (WhatsApp ignores relative URLs).
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://pyramid-studio-xi.vercel.app');

export async function generateMetadata(): Promise<Metadata> {
  const [c, lang] = await Promise.all([getContent(), getLang()]);
  const tx = makeT(c, lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: tx('meta_home'),
    description: tx('meta_desc'),
    icons: { icon: '/favicon.svg' },
    openGraph: {
      type: 'website',
      siteName: lang === 'ar' ? 'استوديو هرم' : 'Pyramid Studio',
      locale: lang === 'ar' ? 'ar_IQ' : 'en_US',
      title: tx('meta_home'),
      description: tx('meta_desc'),
      url: '/'
    },
    twitter: { card: 'summary_large_image', title: tx('meta_home'), description: tx('meta_desc') }
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [c, lang] = await Promise.all([getContent(), getLang()]);
  const tx = makeT(c, lang);
  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Markazi+Text:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteClient
          lang={lang}
          works={c.works}
          categories={c.categories}
          texts={{ client: tx('client'), year: tx('year'), category: tx('category'), visit: tx('visit'), open_ig: tx('open_ig'), cta: tx('cta') }}
        >
          <Header lang={lang} brand={tx('brand')} cta={tx('cta')} logo={logoSVG({ bg: 'none' })} nav={NAV.map(([href, k]) => ({ href, label: tx(k) }))} />
          <main>{children}</main>
          <Footer c={c} lang={lang} />
        </SiteClient>
      </body>
    </html>
  );
}
