import { t } from '@/lib/content/defaults';
import { getContent, getLang, makeT } from '@/lib/content/server';
import { HomeHero } from '@/components/site/HomeHero';
import { ApproachRows, ClientsMarquee, Cta, Featured, Stats, featuredFirst } from '@/components/site/blocks';

export default async function Home() {
  const [c, lang] = await Promise.all([getContent(), getLang()]);
  const tx = makeT(c, lang);
  const keys = ['see_work', 'how', 'fc1_s', 'fc2_s', 'orbit_label', 'orbit_hint', 'trust', 'less', 'about_k', 'know_more'];
  const orbit = c.orbit
    .map((o) => { const s = c.services.find((x) => x.id === o.service); return s ? { service: s.id, title: t(s.title, lang), sub: t(o.sub, lang) } : null; })
    .filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <>
      <HomeHero
        lang={lang}
        works={featuredFirst(c.works)}
        categories={c.categories}
        orbit={orbit}
        logos={c.clients.filter((x) => x.logo).slice(0, 3).map((x) => ({ logo: x.logo }))}
        years={c.settings.years}
        projects={c.settings.projects}
        followers={c.settings.followers}
        about={t(c.settings.about, lang)}
        tx={Object.fromEntries(keys.map((k) => [k, tx(k)]))}
      />
      <ApproachRows c={c} lang={lang} />
      <Featured c={c} lang={lang} />
      <Stats c={c} lang={lang} />
      <ClientsMarquee c={c} lang={lang} />
      <Cta c={c} lang={lang} />
    </>
  );
}
