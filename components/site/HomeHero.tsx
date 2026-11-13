'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { logoSVG } from '@/lib/art';
import { t } from '@/lib/content/defaults';
import type { Category, Lang, Work } from '@/lib/content/types';
import { Media } from './Media';
import { useSite } from './SiteClient';
import { PlayIcon, Svg } from './Svg';

export type OrbitItem = { service: string; title: string; sub: string };
type Logo = { logo: string };

const icon = (d: string) =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

/** Fixed look for each service's orbit label (colours + icon). */
const ORBIT_STYLE: Record<string, { bg: string; fg: string; icon: string }> = {
  content: { bg: '#141210', fg: '#FFFFFF', icon: icon('<path d="M4 20h4L19 9l-4-4L4 16z"/>') },
  photo: { bg: '#C9962F', fg: '#141210', icon: icon('<path d="M4 8h3l2-3h6l2 3h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/>') },
  edit: { bg: '#E6E6E3', fg: '#141210', icon: icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 12h4M17 12h4"/>') },
  promo: { bg: '#141210', fg: '#C9962F', icon: icon('<path d="M4 10v4h3l6 4V6L7 10Z"/><path d="M17 9a4 4 0 0 1 0 6"/>') },
  social: { bg: '#FFFFFF', fg: '#141210', icon: icon('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>') },
  reports: { bg: '#C9962F', fg: '#141210', icon: icon('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>') },
  analysis: { bg: '#141210', fg: '#FFFFFF', icon: icon('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>') },
  plans: { bg: '#E6E6E3', fg: '#141210', icon: icon('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 9h6M9 13h6M9 17h3"/>') },
  web: { bg: '#FFFFFF', fg: '#141210', icon: icon('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>') }
};
const FALLBACK = Object.values(ORBIT_STYLE);

type Props = {
  lang: Lang;
  works: Work[];
  categories: Category[];
  orbit: OrbitItem[];
  logos: Logo[];
  years: number;
  projects: number;
  followers: number;
  about: string;
  tx: Record<string, string>;
};

const fmt = (n: number) => Number(n || 0).toLocaleString('en-US');

export function HomeHero({ lang, works, categories, orbit, logos, years, projects, followers, about, tx }: Props) {
  const { openWork } = useSite();
  const heroRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const connRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const orbitSvgRef = useRef<SVGSVGElement>(null);
  const fc1 = useRef<HTMLDivElement>(null);
  const fc2 = useRef<HTMLDivElement>(null);

  const reels = works.slice(0, 6);
  const reelIds = reels.map((w) => w.id);
  const items: ({ w: Work } | { l: OrbitItem; i: number })[] = [];
  reels.forEach((w, i) => { items.push({ w }); if (orbit[i]) items.push({ l: orbit[i], i }); });
  const catEn = (id: string) => { const c = categories.find((x) => x.id === id); return c ? t(c.name, 'en') : ''; };

  useEffect(() => {
    const el = orbitRef.current, hero = heroRef.current, path = pathRef.current, svg = orbitSvgRef.current, conn = connRef.current;
    if (!el || !hero || !path || !svg || !conn) return;
    const cards = [...el.querySelectorAll<HTMLElement>('.oc')];
    const N = cards.length;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dir = lang === 'ar' ? -1 : 1;
    const AUTO = reduce ? 0 : 0.17 * dir;
    let base = 0.35, vel = AUTO, hover = false, moved = 0, visible = true, last = performance.now();
    let drag: { x: number; t: number } | null = null;
    let tz = -7, tzT = -7, k = 0.17, kT = 0.17;
    let hoverCard: HTMLElement | null = null;
    let raf = 0;
    const P = 1500;
    const S = { W: 0, H: 0, cx: 0, cy: 0, R: 0 };

    const measure = () => {
      const r = el.getBoundingClientRect();
      S.W = r.width; S.H = r.height; S.cx = r.width / 2; S.cy = r.height * 0.43;
      S.R = Math.min(500, r.width * (r.width < 700 ? 0.4 : 0.39));
      svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    };
    const drawConnectors = () => {
      if (getComputedStyle(conn).display === 'none') return;
      const hb = hero.getBoundingClientRect(), ob = el.getBoundingClientRect();
      const R = S.R || ob.width * 0.4, cy = ob.top - hb.top + (S.cy || ob.height * 0.47);
      const cx = ob.left - hb.left + ob.width / 2;
      conn.innerHTML = [fc1.current, fc2.current].map((c) => {
        if (!c || getComputedStyle(c).display === 'none') return '';
        const b = c.getBoundingClientRect();
        const left = b.left + b.width / 2 < hb.left + hb.width / 2;
        const sx = b.left - hb.left + b.width / 2, sy = b.bottom - hb.top - 6;
        const ex = cx + (left ? -R * 0.98 : R * 0.98), ey = cy + 6;
        return `<path d="M${sx} ${sy} C ${sx} ${sy + 140}, ${ex} ${ey - 160}, ${ex} ${ey}"/><circle cx="${sx}" cy="${sy}" r="3.5"/><circle cx="${ex}" cy="${ey}" r="3.5"/>`;
      }).join('');
      conn.setAttribute('viewBox', `0 0 ${hb.width} ${hb.height}`);
    };
    measure();

    const project = (th: number) => {
      const x = S.R * Math.sin(th), z = S.R * Math.cos(th);
      const y = S.R * k * Math.cos(th) + x * Math.tan(tz * Math.PI / 180);
      const s = P / (P - z);
      return { x: S.cx + x * s, y: S.cy + y * s, z, s };
    };
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!drag) { vel += ((hover ? 0 : AUTO) - vel) * Math.min(1, dt * (hover ? 6 : 1.6)); base += vel * dt; }
      tz += (tzT - tz) * Math.min(1, dt * 4); k += (kT - k) * Math.min(1, dt * 4);
      cards.forEach((c, i) => {
        const th = base + (i * 2 * Math.PI) / N;
        const p = project(th), depth = (Math.cos(th) + 1) / 2;
        const rotY = Math.sin(th) * 36 * (Math.cos(th) >= 0 ? 1 : -1);
        const lift = c === hoverCard ? 1.1 : 1;
        c.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${(p.s * lift).toFixed(3)}) perspective(700px) rotateY(${rotY.toFixed(1)}deg) rotateZ(${(tz * 0.6).toFixed(1)}deg)`;
        c.style.zIndex = String(200 + Math.round(p.z));
        c.style.opacity = (0.3 + 0.7 * depth).toFixed(2);
        c.style.filter = depth < 0.3 ? `blur(${((0.3 - depth) * 7).toFixed(1)}px)` : '';
        c.tabIndex = depth > 0.45 ? 0 : -1;
      });
      let d = '';
      for (let j = 0; j <= 64; j++) { const p = project((j / 64) * Math.PI * 2); d += (j ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }
      path.setAttribute('d', d);
      if (visible) raf = requestAnimationFrame(frame);
    };

    const onDown = (e: PointerEvent) => { if (e.button !== undefined && e.button !== 0) return; drag = { x: e.clientX, t: performance.now() }; moved = 0; el.classList.add('dragging'); };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!drag) {
        const mx = (e.clientX - r.left) / r.width, my = (e.clientY - r.top) / r.height;
        if (mx >= 0 && mx <= 1 && my >= -0.6 && my <= 1) { tzT = -7 + (mx - 0.5) * 8; kT = 0.17 + (my - 0.5) * 0.12; }
        return;
      }
      const now = performance.now(), dx = e.clientX - drag.x, dtt = Math.max(0.008, (now - drag.t) / 1000);
      moved += Math.abs(dx);
      const d = dx / S.R;
      base += d; vel = Math.max(-4, Math.min(4, d / dtt));
      drag.x = e.clientX; drag.t = now;
    };
    const onUp = () => { if (!drag) return; drag = null; el.classList.remove('dragging'); };
    const onClickCapture = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };

    el.addEventListener('pointerdown', onDown);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerup', onUp);
    addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClickCapture, true);
    const cardOff: (() => void)[] = [];
    cards.forEach((c) => {
      const enter = () => { hover = true; hoverCard = c; };
      const leave = () => { hover = false; hoverCard = null; };
      const noDrag = (e: Event) => e.preventDefault();
      const click = () => { if (moved <= 6 && c.dataset.work) openWork(c.dataset.work, reelIds); };
      c.addEventListener('pointerenter', enter); c.addEventListener('pointerleave', leave);
      c.addEventListener('focus', enter); c.addEventListener('blur', leave);
      c.addEventListener('dragstart', noDrag); c.addEventListener('click', click);
      cardOff.push(() => {
        c.removeEventListener('pointerenter', enter); c.removeEventListener('pointerleave', leave);
        c.removeEventListener('focus', enter); c.removeEventListener('blur', leave);
        c.removeEventListener('dragstart', noDrag); c.removeEventListener('click', click);
      });
    });
    const ro = new ResizeObserver(() => { measure(); drawConnectors(); });
    ro.observe(el);
    const io = new IntersectionObserver(([en]) => {
      const was = visible; visible = en.isIntersecting;
      if (visible && !was) { last = performance.now(); raf = requestAnimationFrame(frame); }
    });
    io.observe(el);
    const onResize = () => drawConnectors();
    addEventListener('resize', onResize);
    const timers = [setTimeout(drawConnectors, 60), setTimeout(drawConnectors, 1000)];
    document.fonts?.ready.then(drawConnectors);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      el.removeEventListener('pointerdown', onDown);
      removeEventListener('pointermove', onMove); removeEventListener('pointerup', onUp); removeEventListener('pointercancel', onUp);
      removeEventListener('resize', onResize);
      el.removeEventListener('click', onClickCapture, true);
      cardOff.forEach((f) => f());
      ro.disconnect(); io.disconnect();
    };
    // reelIds is derived from works; re-run when the cards change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, works, orbit, openWork]);

  const avatars = (
    <div className="avatars">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {logos.map((c, i) => <span key={i}><img src={c.logo} alt="" loading="lazy" /></span>)}
      <span className="plus">+</span>
    </div>
  );

  return (
    <section className="hero" id="heroM" ref={heroRef}>
      <svg className="connectors" ref={connRef} aria-hidden="true" />
      {/*
        Top row of the hero, laid out as a 3-column grid in site.css (.hero-top):
          start column → years card (fc-1) + spinning badge
          middle       → the two buttons
          end column   → projects card with client logos (fc-2)
        The cards sit in their own row so they never overlap the orbit below.
        The dotted connector lines from each card down to the orbit are drawn in the effect above.
      */}
      <div className="container hero-top">
        <div className="hero-cta load d5">
          <Link href="/work" className="btn btn-ink">{tx.see_work}</Link>
          <Link href="/services#process" className="btn btn-ghost"><span className="play"><PlayIcon /></span>{tx.how}</Link>
        </div>
        <div className="float-card fc-1 load d5" ref={fc1}>
          <span className="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12h2M8 7v10M12 4v16M16 8v8M20 11v2" /></svg></span>
          <span className="big">+{fmt(years)}</span>
          <p>{tx.fc1_s}</p>
        </div>
        <div className="float-card fc-2 load d6" ref={fc2}>
          {avatars}
          <span className="big">+{fmt(projects)}</span>
          <p>{tx.fc2_s}</p>
        </div>
        <div className="badge-rot load d4" aria-hidden="true">
          <Svg html={'<svg class="ring" viewBox="0 0 120 120" direction="ltr" style="direction:ltr"><defs><path id="circ" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs><text direction="ltr"><textPath href="#circ" textLength="284" lengthAdjust="spacing">PYRAMID • STUDIO • هرم • IRAQ • هرم •</textPath></text></svg>'} />
          <span className="star">✦</span>
        </div>
      </div>

      <div className="orbit load d6" ref={orbitRef} role="region" aria-label={tx.orbit_label}>
        <svg className="orbit-path" ref={orbitSvgRef} aria-hidden="true"><path ref={pathRef} /></svg>
        <div className="orbit-core" aria-hidden="true">
          <span className="halo" />
          <Svg html={logoSVG({ bg: 'none', cls: 'core-logo' })} />
          <span className="core-shadow" />
        </div>
        {items.map((it) => 'w' in it ? (
          <button className="oc oc-reel" key={'w' + it.w.id} data-work={it.w.id} aria-label={t(it.w.title, lang)}>
            <Media w={it.w} catEn={catEn(it.w.category)} mode="eager" />
            <span className="play"><PlayIcon /></span>
            <span className="cap">{t(it.w.title, lang)}</span>
          </button>
        ) : (
          <Link className="oc oc-label" key={'l' + it.i} href={`/services#svc-${it.l.service}`}>
            {(() => {
              const s = ORBIT_STYLE[it.l.service] || FALLBACK[it.i % FALLBACK.length];
              return <span className="ic" style={{ background: s.bg, color: s.fg }} dangerouslySetInnerHTML={{ __html: s.icon }} />;
            })()}
            <b>{it.l.title}</b>
            <small>{it.l.sub}</small>
          </Link>
        ))}
        <div className="orbit-hint" aria-hidden="true">{tx.orbit_hint}</div>
      </div>

      <div className="container orbit-foot">
        <div className="trust"><div className="dash" /><p><b>+{fmt(followers)}</b><br />{tx.trust}</p>{avatars}</div>
        <div className="less"><div className="dash" /><p>✦<br />{tx.less}</p></div>
      </div>

      <div className="container">
        <div className="divider" />
        <div className="intro reveal">
          <span className="kicker">{tx.about_k}</span>
          <p style={{ marginTop: 12 }}>{about}</p>
          <Link href="/about" className="btn btn-line">{tx.know_more}</Link>
        </div>
      </div>
    </section>
  );
}
