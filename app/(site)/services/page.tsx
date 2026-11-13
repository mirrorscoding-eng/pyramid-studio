import type { Metadata } from 'next';
import { t } from '@/lib/content/defaults';
import { getContent, getLang, makeT } from '@/lib/content/server';
import { Cta, PageHero, ServicesRows } from '@/components/site/blocks';
import { Process } from '@/components/site/Process';

export async function generateMetadata(): Promise<Metadata> {
  const [c, lang] = await Promise.all([getContent(), getLang()]);
  return { title: makeT(c, lang)('meta_services') };
}

export default async function Services() {
  const [c, lang] = await Promise.all([getContent(), getLang()]);
  const tx = makeT(c, lang);
  return (
    <>
      <PageHero c={c} lang={lang} k="services" artKey="content" />
      <ServicesRows c={c} lang={lang} />
      <Process
        kicker={tx('process_k')} h1={tx('process_h1')} h2={tx('process_h2')} lead={tx('process_p')}
        steps={c.steps.map((s) => ({ title: t(s.title, lang), desc: t(s.desc, lang) }))}
      />
      <Cta c={c} lang={lang} />
    </>
  );
}
