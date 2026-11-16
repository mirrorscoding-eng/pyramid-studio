import type { Metadata } from 'next';
import { getSiteContent, getLang, makeT } from '@/lib/content/server';
import { sectionOn } from '@/lib/content/sections';
import { ClientsMarquee, Cta, PageHero } from '@/components/site/blocks';
import { WorkGrid } from '@/components/site/WorkGrid';

export async function generateMetadata(): Promise<Metadata> {
  const [c, lang] = await Promise.all([getSiteContent(), getLang()]);
  return { title: makeT(c, lang)('meta_work') };
}

export default async function WorkPage() {
  const [c, lang] = await Promise.all([getSiteContent(), getLang()]);
  const tx = makeT(c, lang);
  return (
    <>
      <PageHero c={c} lang={lang} k="work" artKey="photo" />
      {sectionOn(c, 'work.grid') && <WorkGrid works={c.works} categories={c.categories} allLabel={tx('all')} emptyLabel={tx('empty')} />}
      {sectionOn(c, 'work.clients') && <ClientsMarquee c={c} lang={lang} />}
      {sectionOn(c, 'work.cta') && <Cta c={c} lang={lang} />}
    </>
  );
}
