'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { t } from '@/lib/content/defaults';
import type { Category, Lang, Work } from '@/lib/content/types';
import { Media } from './Media';
import { PlayIcon } from './Svg';

type ModalTexts = { client: string; year: string; category: string; visit: string; open_ig: string; cta: string };

type SiteCtx = {
  lang: Lang;
  openWork: (id: string, listIds?: string[]) => void;
  toast: (msg: string) => void;
};

const Ctx = createContext<SiteCtx | null>(null);

export const useSite = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSite must be used inside <SiteClient>');
  return c;
};

const igEmbed = (link: string) => {
  const m = String(link || '').match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/);
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed/` : '';
};

const fmt = (n: number) => Number(n || 0).toLocaleString('en-US');

export function SiteClient({
  children, lang, works, categories, texts
}: { children: React.ReactNode; lang: Lang; works: Work[]; categories: Category[]; texts: ModalTexts }) {
  const [open, setOpen] = useState<{ id: string; list: string[] } | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const openWork = useCallback((id: string, listIds?: string[]) => {
    setOpen({ id, list: listIds && listIds.length ? listIds : works.map((w) => w.id) });
  }, [works]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastOn(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 3200);
  }, []);

  const value = useMemo(() => ({ lang, openWork, toast }), [lang, openWork, toast]);

  useReveal();

  return (
    <Ctx.Provider value={value}>
      {children}
      <WorkModal state={open} setState={setOpen} works={works} categories={categories} texts={texts} lang={lang} />
      <div className={`toast${toastOn ? ' show' : ''}`} role="status" aria-live="polite">{toastMsg}</div>
    </Ctx.Provider>
  );
}

/* ---------------- modal ---------------- */
function WorkModal({
  state, setState, works, categories, texts, lang
}: {
  state: { id: string; list: string[] } | null;
  setState: (s: { id: string; list: string[] } | null) => void;
  works: Work[]; categories: Category[]; texts: ModalTexts; lang: Lang;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [ready, setReady] = useState(false);
  const w = state ? works.find((x) => x.id === state.id) : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (w && !d.open) d.showModal();
    if (!w && d.open) d.close();
    setReady(false);
    const inner = d.querySelector('.modal-inner');
    if (inner) inner.scrollTop = 0;
  }, [w]);

  const list = state?.list || [];
  const idx = w ? list.indexOf(w.id) : -1;
  const go = useCallback((step: number) => {
    if (!state || idx < 0 || list.length < 2) return;
    setState({ id: list[(idx + step + list.length) % list.length], list });
  }, [state, idx, list, setState]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!ref.current?.open || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const forward = (e.key === 'ArrowLeft') === (lang === 'ar');
      go(forward ? 1 : -1);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [go, lang]);

  const cat = w ? categories.find((c) => c.id === w.category) : undefined;
  const catName = cat ? t(cat.name, lang) : '';
  const catEn = cat ? t(cat.name, 'en') : '';
  const results = w ? (w.results || []).filter((r) => r && r.value) : [];
  const isIg = w ? /instagram\.com/.test(w.link || '') : false;
  const embed = w && !w.video ? igEmbed(w.link) : '';

  return (
    <dialog
      className="modal"
      ref={ref}
      aria-labelledby="mTitle"
      onClose={() => setState(null)}
      onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
    >
      <div className="modal-inner">
        {w && (
          <>
            {w.video ? (
              <div className="modal-media">
                <video src={w.video} poster={w.image || undefined} controls autoPlay playsInline />
              </div>
            ) : embed ? (
              <div className={`modal-media embed${ready ? ' ready' : ''}`}>
                <div className="embed-wait" aria-hidden="true"><Media w={w} catEn={catEn} /><span className="spin" /></div>
                <iframe
                  key={embed}
                  src={embed}
                  title={t(w.title, lang)}
                  allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
                  allowFullScreen
                  scrolling="no"
                  onLoad={() => setReady(true)}
                />
              </div>
            ) : (
              <div className="modal-media">
                <Media w={w} catEn={catEn} />
                {w.link && <a className="play" href={w.link} target="_blank" rel="noopener" aria-label={texts.visit}><PlayIcon /></a>}
              </div>
            )}
            <div className="modal-tools">
              {list.length > 1 && idx > -1 && (
                <>
                  <button onClick={() => go(-1)} aria-label="Previous">{lang === 'ar' ? '→' : '←'}</button>
                  <button onClick={() => go(1)} aria-label="Next">{lang === 'ar' ? '←' : '→'}</button>
                </>
              )}
              <button onClick={() => ref.current?.close()} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              {catName && <span className="kicker">{catName}</span>}
              <h3 id="mTitle">{t(w.title, lang)}</h3>
              {t(w.summary, lang) && <p className="sum">{t(w.summary, lang)}</p>}
              {results.length > 0 && (
                <div className="results">
                  {results.map((r, i) => <div className="result" key={i}><b>{r.value}</b><span>{t(r.label, lang)}</span></div>)}
                </div>
              )}
              <div className="meta-list">
                <div><span>{texts.client}</span><b>{t(w.client, lang)}</b></div>
                {w.year ? <div><span>{texts.year}</span><b>{w.year}</b></div> : null}
                {catName && <div><span>{texts.category}</span><b>{catName}</b></div>}
              </div>
              {(w.services || []).length > 0 && (
                <div className="svc-tags">{w.services.map((s, i) => <span className="tag" key={i}>{s}</span>)}</div>
              )}
              <div className="acts">
                {w.link && (
                  <a className={`btn ${embed ? 'btn-line' : 'btn-ink'} ig-btn`} href={w.link} target="_blank" rel="noopener">
                    {isIg ? (
                      <>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
                        {texts.open_ig}
                      </>
                    ) : texts.visit}
                  </a>
                )}
                <Link className="btn btn-line" href="/contact" onClick={() => ref.current?.close()}>{texts.cta}</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

/* ---------------- reveal on scroll + number counters ---------------- */
function countUp(el: HTMLElement) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const end = Number(el.dataset.count);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) { el.textContent = '+' + fmt(end); return; }
  const t0 = performance.now(), dur = 1600;
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = '+' + fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function useReveal() {
  useEffect(() => {
    const show = (el: Element) => {
      el.classList.add('in');
      const c = el.querySelector<HTMLElement>('[data-count]');
      if (c) countUp(c);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    const scan = () => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}
