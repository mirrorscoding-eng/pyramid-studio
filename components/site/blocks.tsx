import Link from 'next/link';
import { art, engravedPyramid, logoSVG } from '@/lib/art';
import { t } from '@/lib/content/defaults';
import { makeT } from '@/lib/content/server';
import type { Content, Lang, Member, Work } from '@/lib/content/types';
import { ReelCard } from './ReelCard';
import { Html, Svg } from './Svg';

type P = { c: Content; lang: Lang };

export const fmt = (n: number) => Number(n || 0).toLocaleString('en-US');
export const digits = (p: string) => String(p || '').replace(/[^\d+]/g, '');
export const waLink = (p: string) => `https://wa.me/${digits(p).replace('+', '')}`;

export const NAV: [href: string, key: string][] = [
  ['/', 'nav_home'], ['/about', 'nav_about'], ['/services', 'nav_services'], ['/work', 'nav_work'], ['/contact', 'nav_contact']
];

const catOf = (c: Content, id: string) => c.categories.find((x) => x.id === id);
export const catName = (c: Content, id: string, lang: Lang) => { const k = catOf(c, id); return k ? t(k.name, lang) : ''; };

/** Featured works first, then the rest. */
export const featuredFirst = (works: Work[]) => [...works.filter((w) => w.featured), ...works.filter((w) => !w.featured)];

function TwoLine({ a, b }: { a: string; b: string }) {
  return <h2 className="h2"><span>{a}</span> <em>{b}</em></h2>;
}

function Hashtag({ value, className }: { value: string; className?: string }) {
  const v = (value || '').replace(/^#/, '');
  const i = v.indexOf('_');
  return (
    <p className={className}>#{i > 0 ? <><span>{v.slice(0, i)}</span>{v.slice(i)}</> : v}</p>
  );
}

export function PageHero({ c, lang, k, artKey }: P & { k: string; artKey: string }) {
  const tx = makeT(c, lang);
  return (
    <section className="page-hero">
      <div className="container">
        <Html className="art load d1" html={art(artKey, 'ph' + k)} />
        <nav className="crumbs load d1" aria-label="Breadcrumb"><Link href="/">{tx('nav_home')}</Link><span>/</span><span>{tx(`ph_${k}_k`)}</span></nav>
        <h1 className="display"><span className="l1 load d2">{tx(`ph_${k}_1`)}</span><span className="l2 load d3">{tx(`ph_${k}_2`)}</span></h1>
        <p className="lead load d4">{tx(`ph_${k}_p`)}</p>
        <div className="divider load d5" />
      </div>
    </section>
  );
}

export function ApproachRows({ c, lang }: P) {
  return (
    <section className="rows"><div className="container">
      {c.approach.map((a, i) => (
        <article className="row reveal" key={i}>
          <Html className="row-art" html={art(a.art, 'ar' + i)} />
          <div><span className="row-num">0{i + 1} / {t(a.title, lang)}</span><h3>{t(a.heading, lang)}</h3><p>{t(a.desc, lang)}</p></div>
        </article>
      ))}
    </div></section>
  );
}

export function Featured({ c, lang }: P) {
  const tx = makeT(c, lang);
  const list = featuredFirst(c.works).slice(0, 4);
  const ids = list.map((w) => w.id);
  return (
    <section className="sec" style={{ paddingTop: 60 }}><div className="container">
      <div className="sec-head reveal">
        <div><span className="kicker">{tx('feat_k')}</span><TwoLine a={tx('feat_h1')} b={tx('feat_h2')} /></div>
        <Link href="/work" className="btn btn-line">{tx('all_work')} ({c.works.length})</Link>
      </div>
      <div className="reels featured-scroll">
        {list.map((w) => <ReelCard key={w.id} w={w} catName={catName(c, w.category, lang)} catEn={catName(c, w.category, 'en')} listIds={ids} />)}
      </div>
    </div></section>
  );
}

export function Stats({ c, lang }: P) {
  const tx = makeT(c, lang);
  const st = c.settings;
  const items: [number, string][] = [[st.years, 'st_years'], [st.projects, 'st_projects'], [st.clientsCount, 'st_clients'], [st.followers, 'st_followers']];
  return (
    <section className="stats"><div className="container">
      <span className="kicker">{tx('stats_k')}</span>
      <div className="stats-grid">
        {items.map(([v, k]) => (
          <div className="stat reveal" key={k}><span className="v" data-count={Number(v) || 0}>+0</span><p className="l">{tx(k)}</p></div>
        ))}
      </div>
      {st.hashtag && <Hashtag value={st.hashtag} className="hash reveal" />}
    </div></section>
  );
}

function ClientLogo({ name, logo, cls }: { name: string; logo: string; cls: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={cls || undefined} src={logo} alt={name} loading="lazy" />;
}

export function ClientsMarquee({ c, lang }: P) {
  const tx = makeT(c, lang);
  const cl = c.clients || [];
  if (!cl.length) return null;
  const row = (dup: string) => cl.map((x) => (x.logo
    ? <ClientLogo key={dup + x.id} cls="logo" name={t(x.name, lang)} logo={x.logo} />
    : <span key={dup + x.id} className="name">{t(x.name, lang)}</span>));
  return (
    <section className="sec" style={{ paddingBottom: 0 }}>
      <div className="container reveal" style={{ textAlign: 'center', marginBottom: 28 }}><span className="kicker">{tx('clients_k')}</span></div>
      <div className="marquee" aria-label={tx('clients_k')}><div className="marquee-track">{row('a')}{row('b')}</div></div>
    </section>
  );
}

export function Cta({ c, lang }: P) {
  const tx = makeT(c, lang);
  const st = c.settings;
  return (
    <section className="cta-band"><div className="container">
      <div className="cta-box reveal">
        <div>
          <TwoLine a={tx('cta_h1')} b={tx('cta_h2')} />
          <p>{tx('cta_p')}</p>
          <div className="acts">
            <Link href="/contact" className="btn btn-paper">{tx('cta')}</Link>
            {st.whatsapp && <a href={waLink(st.whatsapp)} target="_blank" rel="noopener" className="btn btn-ghost-paper">{tx('whatsapp')}</a>}
          </div>
        </div>
        <Html className="pyr" html={logoSVG({ ink: '#FFFFFF', bg: 'none' })} />
      </div>
    </div></section>
  );
}

const RING = (id: string, text: string) =>
  `<svg class="ring" viewBox="0 0 120 120" direction="ltr" style="direction:ltr"><defs><path id="${id}" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs><text direction="ltr"><textPath href="#${id}" textLength="284" lengthAdjust="spacing">${text}</textPath></text></svg>`;

export function Badge({ id, text, className = 'badge-rot' }: { id: string; text: string; className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Svg html={RING(id, text)} />
      <span className="star">✦</span>
    </div>
  );
}

export function AboutBlock({ c, lang }: P) {
  const tx = makeT(c, lang);
  const st = c.settings;
  return (
    <section className="sec"><div className="container about-grid">
      <div className="about-img reveal">
        <div className="frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {st.aboutImage ? <img src={st.aboutImage} alt="Pyramid Studio" loading="lazy" /> : <Svg html={engravedPyramid({ id: 'ab' })} />}
        </div>
        <div className="sticker"><b>+{fmt(st.years)}</b><span>{tx('years_exp')}</span></div>
        <Badge id="circ2" text={`PYRAMID • STUDIO • هرم • ${st.years}+ YEARS •`} />
      </div>
      <div className="about-text reveal">
        <span className="kicker">{tx('about_k')}</span>
        <p className="big">{t(st.about, lang)}</p>
        <ul className="pillars">{c.approach.map((a, i) => <li key={i}>{t(a.heading, lang)}</li>)}</ul>
      </div>
    </div></section>
  );
}

export function ApproachCards({ c, lang }: P) {
  const tx = makeT(c, lang);
  return (
    <section className="sec" style={{ paddingTop: 20 }}><div className="container">
      <div className="reveal" style={{ marginBottom: 34 }}><span className="kicker">{tx('approach_k')}</span></div>
      <div className="approach">
        {c.approach.map((a, i) => (
          <article className="ap-card reveal" key={i}><span className="n">0{i + 1}</span><h3>{t(a.title, lang)}</h3><p>{t(a.desc, lang)}</p></article>
        ))}
      </div>
    </div></section>
  );
}

export function Team({ c, lang }: P) {
  const tx = makeT(c, lang);
  if (!c.team.length) return null;
  const leads = c.team.filter((m) => m.featured);
  const rest = c.team.filter((m) => !m.featured);
  const card = (m: Member, lead: boolean) => (
    <article className={`member reveal${m.photo ? ' has-photo' : ''}${lead ? ' lead' : ''}`} key={m.id}>
      {lead && <span className="lead-tag">{tx('team_lead')}</span>}
      {m.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <div className="portrait"><img src={m.photo} alt={t(m.name, lang)} loading={lead ? 'eager' : 'lazy'} decoding="async" /></div>
      ) : (
        <div className="av"><span>{(t(m.name, lang) || '?').trim().charAt(0)}</span></div>
      )}
      <b>{t(m.name, lang)}</b><small>{t(m.role, lang)}</small>
    </article>
  );
  return (
    <section className="sec" style={{ background: 'var(--paper-2)', borderBlock: '1px solid var(--line)' }}><div className="container">
      <div className="sec-head reveal"><div><span className="kicker">{tx('team_k')}</span><TwoLine a={tx('team_h1')} b={tx('team_h2')} /></div></div>
      {leads.length > 0 && <div className="team-lead">{leads.map((m) => card(m, true))}</div>}
      {rest.length > 0 && <div className="team">{rest.map((m) => card(m, false))}</div>}
    </div></section>
  );
}

export function ClientsGrid({ c, lang }: P) {
  const tx = makeT(c, lang);
  if (!c.clients.length) return null;
  return (
    <section className="sec"><div className="container">
      <div className="sec-head reveal"><div><span className="kicker">{tx('clients_k')}</span></div></div>
      <div className="logo-grid">
        {c.clients.map((x) => (
          <div className="logo-tile reveal" key={x.id} title={t(x.name, lang)}>
            {x.logo ? <ClientLogo cls="" name={t(x.name, lang)} logo={x.logo} /> : <span>{t(x.name, lang)}</span>}
          </div>
        ))}
      </div>
    </div></section>
  );
}

export function ServicesRows({ c, lang }: P) {
  return (
    <section className="rows" id="list"><div className="container">
      {c.services.map((s, i) => (
        <article className="row reveal" id={`svc-${s.id}`} key={s.id}>
          <Html className="row-art" html={art(s.art, 'sv' + i)} />
          <div><span className="row-num">{String(i + 1).padStart(2, '0')} /</span><h3>{t(s.title, lang)}</h3><p>{t(s.desc, lang)}</p></div>
        </article>
      ))}
    </div></section>
  );
}

export function Footer({ c, lang }: P) {
  const tx = makeT(c, lang);
  const st = c.settings;
  return (
    <footer className="footer">
      <div className="container">
        <div className="foot-grid">
          <div>
            <Link href="/" className="brand"><Svg html={logoSVG({ bg: 'none' })} /><span className="wm"><b>{tx('brand')}</b><small>PYRAMID STUDIO</small></span></Link>
            <p>{t(st.eyebrow, lang)}{st.hashtag ? ` — #${st.hashtag.replace(/^#/, '')}` : ''}</p>
          </div>
          <div><h4>{tx('f_pages')}</h4><ul>{NAV.map(([href, k]) => <li key={href}><Link href={href}>{tx(k)}</Link></li>)}</ul></div>
          <div><h4>{tx('f_contact')}</h4><ul>
            {(st.phones || []).filter(Boolean).map((p) => <li key={p}><a className="ltr" href={`tel:${digits(p)}`}>{p}</a></li>)}
            {st.email && <li><a className="ltr" href={`mailto:${st.email}`}>{st.email}</a></li>}
          </ul></div>
          <div><h4>{tx('f_follow')}</h4><ul>
            {st.instagram && <li><a href={`https://instagram.com/${st.instagram}`} target="_blank" rel="noopener">Instagram</a></li>}
            {st.threads && <li><a href={`https://threads.net/@${st.threads}`} target="_blank" rel="noopener">Threads</a></li>}
            {st.studio && <li><a href={`https://instagram.com/${st.studio}`} target="_blank" rel="noopener">@{st.studio}</a></li>}
            {st.whatsapp && <li><a href={waLink(st.whatsapp)} target="_blank" rel="noopener">WhatsApp</a></li>}
          </ul></div>
        </div>
        <div className="footer-row"><span>© {new Date().getFullYear()} {tx('rights')}</span><Link href="/dashboard">{tx('dashboard')}</Link></div>
      </div>
    </footer>
  );
}
