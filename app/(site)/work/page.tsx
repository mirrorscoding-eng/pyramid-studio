import type { Metadata } from 'next';
import { getContent, getLang, makeT } from '@/lib/content/server';
import { ClientsMarquee, Cta, PageHero } from '@/components/site/blocks';
import { WorkGrid } from '@/components/site/WorkGrid';

export async function generateMetadata(): Promise<Metadata> {
  const [c, lang] = await Promise.all([getContent(), getLang()]);
  return { title: makeT(c, lang)('meta_work') };
}

export default async function WorkPage() {
  const [c, lang] = await Promise.all([getContent(), getLang()]);
  const tx = makeT(c, lang);
  return (
    <>
      <PageHero c={c} lang={lang} k="work" artKey="photo" />
      <WorkGrid works={c.works} categories={c.categories} allLabel={tx('all')} emptyLabel={tx('empty')} />
      <ClientsMarquee c={c} lang={lang} />
      <Cta c={c} lang={lang} />
    </>
  );
}
