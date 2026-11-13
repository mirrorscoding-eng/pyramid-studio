import type { Metadata } from 'next';
import { getContent, getLang, makeT } from '@/lib/content/server';
import { AboutBlock, ApproachCards, ClientsGrid, Cta, PageHero, Stats, Team } from '@/components/site/blocks';

export async function generateMetadata(): Promise<Metadata> {
  const [c, lang] = await Promise.all([getContent(), getLang()]);
  return { title: makeT(c, lang)('meta_about') };
}

export default async function About() {
  const [c, lang] = await Promise.all([getContent(), getLang()]);
  return (
    <>
      <PageHero c={c} lang={lang} k="about" artKey="plans" />
      <AboutBlock c={c} lang={lang} />
      <ApproachCards c={c} lang={lang} />
      <Stats c={c} lang={lang} />
      <Team c={c} lang={lang} />
      <ClientsGrid c={c} lang={lang} />
      <Cta c={c} lang={lang} />
    </>
  );
}
