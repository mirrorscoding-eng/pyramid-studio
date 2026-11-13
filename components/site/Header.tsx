'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Lang } from '@/lib/content/types';
import { Svg } from './Svg';

export type NavItem = { href: string; label: string };

export function Header({ lang, nav, brand, cta, logo }: { lang: Lang; nav: NavItem[]; brand: string; cta: string; logo: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, startTransition] = useTransition();
  const navRef = useRef<HTMLElement>(null);
  const gliderRef = useRef<HTMLSpanElement>(null);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const placeGlider = useCallback(() => {
    const navEl = navRef.current, g = gliderRef.current;
    const a = navEl?.querySelector<HTMLAnchorElement>('a.active');
    if (!navEl || !g || !a || getComputedStyle(navEl).display === 'none') return;
    const nb = navEl.getBoundingClientRect(), ab = a.getBoundingClientRect();
    g.style.opacity = '1';
    g.style.left = ab.left - nb.left + 'px';
    g.style.width = ab.width + 'px';
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(placeGlider);
    setMenu(false);
    return () => cancelAnimationFrame(id);
  }, [pathname, lang, placeGlider]);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 20);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', placeGlider);
    document.fonts?.ready.then(placeGlider);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', placeGlider); };
  }, [placeGlider]);

  const switchLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`} id="header">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="Pyramid">
            <Svg html={logo} />
            <span className="wm"><b>{brand}</b><small>PYRAMID STUDIO</small></span>
          </Link>
          <nav className="pill-nav" ref={navRef} aria-label="Main">
            <span className="glider" ref={gliderRef} />
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={isActive(n.href) ? 'active' : ''} aria-current={isActive(n.href) ? 'page' : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="nav-end">
            <button className="lang" onClick={switchLang} aria-label="Language">{lang === 'ar' ? 'EN' : 'ع'}</button>
            <Link href="/contact" className="btn btn-ink"><span>{cta}</span></Link>
            <button className={`burger${menu ? ' open' : ''}`} onClick={() => setMenu((o) => !o)} aria-label="Menu" aria-expanded={menu}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <nav className={`mobile-menu${menu ? ' open' : ''}`}>
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={isActive(n.href) ? 'active' : ''}>
            {n.label} <span>{isActive(n.href) ? '✦' : ''}</span>
          </Link>
        ))}
        <Link href="/contact" className="btn btn-ink">{cta}</Link>
      </nav>
    </>
  );
}
