'use client';

import { useCallback, useEffect, useState } from 'react';
import { logoSVG } from '@/lib/art';
import type { Content, Message } from '@/lib/content/types';
import { DashProvider, Icon, useDash } from './ctx';
import { SignOutButton } from './SignOutButton';
import { Overview } from './views/Overview';
import { Works } from './views/Works';
import { Messages } from './views/Messages';
import { Texts } from './views/Texts';
import { ServicesView } from './views/ServicesView';
import { Team } from './views/Team';
import { Clients } from './views/Clients';
import { Categories } from './views/Categories';
import { Settings } from './views/Settings';

const VIEWS = [
  { id: 'overview', title: 'نظرة عامة', sub: 'ملخص سريع لمحتوى موقع هرم.', icon: Icon.overview },
  { id: 'works', title: 'الأعمال', sub: 'أضف، عدّل، ورتّب الأعمال اللي تظهر بالموقع.', icon: Icon.works },
  { id: 'messages', title: 'الرسائل', sub: 'طلبات العملاء من نموذج التواصل بالموقع.', icon: Icon.msg },
  { id: 'texts', title: 'نصوص الصفحات', sub: 'كل نص يظهر بالموقع، مرتب حسب الصفحة.', icon: Icon.text },
  { id: 'services', title: 'الخدمات والنهج', sub: 'الخدمات، الدائرة حول الشعار، النهج، وخطوات آلية العمل.', icon: Icon.layers },
  { id: 'team', title: 'الفريق', sub: 'أعضاء الفريق اللي يظهرون بصفحة من نحن.', icon: Icon.team },
  { id: 'clients', title: 'العملاء', sub: 'شعارات العملاء والشركاء بالموقع.', icon: Icon.clients },
  { id: 'categories', title: 'التصنيفات', sub: 'تصنيفات الفلترة بمعرض الأعمال.', icon: Icon.tag },
  { id: 'settings', title: 'الإعدادات', sub: 'النبذة، معلومات التواصل، الأرقام والنسخ الاحتياطي.', icon: Icon.settings }
] as const;

type ViewId = (typeof VIEWS)[number]['id'];
const isView = (v: string): v is ViewId => VIEWS.some((x) => x.id === v);

export function DashboardApp({ initialContent, initialMessages, email }: { initialContent: Content; initialMessages: Message[]; email: string }) {
  const [view, setView] = useState<ViewId>('overview');
  const [extra, setExtra] = useState('');
  const [side, setSide] = useState(false);

  useEffect(() => {
    const read = () => { const h = location.hash.slice(1); if (isView(h)) setView(h); };
    read();
    addEventListener('hashchange', read);
    return () => removeEventListener('hashchange', read);
  }, []);

  const go = useCallback((v: string, x = '') => {
    if (!isView(v)) v = 'overview';
    setView(v as ViewId);
    setExtra(x);
    setSide(false);
    history.replaceState(null, '', '#' + v);
    scrollTo({ top: 0 });
  }, []);

  return (
    <DashProvider initialContent={initialContent} initialMessages={initialMessages} go={go}>
      <Shell view={view} extra={extra} go={go} side={side} setSide={setSide} email={email} />
    </DashProvider>
  );
}

function Shell({ view, extra, go, side, setSide, email }: { view: ViewId; extra: string; go: (v: string, x?: string) => void; side: boolean; setSide: (v: boolean) => void; email: string }) {
  const { content, messages } = useDash();
  const unread = messages.filter((m) => !m.read).length;
  const meta = VIEWS.find((v) => v.id === view)!;

  return (
    <div className="app">
      <aside className={`side${side ? ' open' : ''}`}>
        <a className="brand" href="/" target="_blank" rel="noopener">
          <span className="svgw" dangerouslySetInnerHTML={{ __html: logoSVG({ bg: 'none' }) }} />
          <span><b>هرم</b><small>DASHBOARD</small></span>
        </a>
        {VIEWS.map((v) => (
          <button key={v.id} className={`nav-btn${view === v.id ? ' active' : ''}`} onClick={() => go(v.id)}>
            {v.icon}<span>{v.title}</span>
            {v.id === 'works' && <span className="badge" style={{ background: 'rgba(255,255,255,.15)', color: 'inherit' }}>{content.works.length}</span>}
            {v.id === 'messages' && unread > 0 && <span className="badge">{unread}</span>}
          </button>
        ))}
        <div className="side-foot">
          <a className="side-btn" href="/" target="_blank" rel="noopener">عرض الموقع ↗</a>
          <SignOutButton />
          <p className="who" title={email}>{email}</p>
        </div>
      </aside>
      <div className={`overlay${side ? ' open' : ''}`} onClick={() => setSide(false)} />

      <main className="main">
        <header className="top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="menu-btn" aria-label="القائمة" onClick={() => setSide(true)}><span /><span /></button>
            <div><h1>{meta.title}</h1><p>{meta.sub}</p></div>
          </div>
          <div className="top-actions" id="topActions" />
        </header>
        <div className="view" key={view}>
          {view === 'overview' && <Overview />}
          {view === 'works' && <Works openId={extra} />}
          {view === 'messages' && <Messages activeId={extra} />}
          {view === 'texts' && <Texts />}
          {view === 'services' && <ServicesView />}
          {view === 'team' && <Team />}
          {view === 'clients' && <Clients />}
          {view === 'categories' && <Categories />}
          {view === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  );
}
