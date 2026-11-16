import type { Metadata } from 'next';
import { getSiteContent, getLang, makeT } from '@/lib/content/server';
import { sectionOn } from '@/lib/content/sections';
import { AboutBlock, ApproachCards, ClientsGrid, Cta, PageHero, Stats, Team } from '@/components/site/blocks';

export async function generateMetadata(): Promise<Metadata> {
  const [c, lang] = await Promise.all([getSiteContent(), getLang()]);
  return { title: makeT(c, lang)('meta_about') };
}

export default async function About() {
  const [c, lang] = await Promise.all([getSiteContent(), getLang()]);
  return (
    <>
      <PageHero c={c} lang={lang} k="about" artKey="plans" />
      {sectionOn(c, 'about.intro') && <AboutBlock c={c} lang={lang} />}
      {sectionOn(c, 'about.approach') && <ApproachCards c={c} lang={lang} />}
      {sectionOn(c, 'about.stats') && <Stats c={c} lang={lang} />}
      {sectionOn(c, 'about.team') && <Team c={c} lang={lang} />}
      {sectionOn(c, 'about.clients') && <ClientsGrid c={c} lang={lang} />}
      {sectionOn(c, 'about.cta') && <Cta c={c} lang={lang} />}
    </>
  );
}
