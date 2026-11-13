'use client';

import { useEffect, useState } from 'react';
import { coverHTML, engravedPyramid } from '@/lib/art';
import { t } from '@/lib/content/defaults';
import { Icon, useDash } from '../ctx';
import { ago, initial } from './util';

export function Overview() {
  const { content, messages, go } = useDash();
  const [grow, setGrow] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setGrow(true)); return () => cancelAnimationFrame(id); }, []);

  const counts = content.categories.map((c) => ({ c, n: content.works.filter((w) => w.category === c.id).length }));
  const max = Math.max(1, ...counts.map((x) => x.n));
  const unread = messages.filter((m) => !m.read).length;
  const catName = (id: string) => t(content.categories.find((c) => c.id === id)?.name, 'ar') || '—';
  const catEn = (id: string) => t(content.categories.find((c) => c.id === id)?.name, 'en');

  return (
    <>
      <section className="card hello">
        <div>
          <h2>أهلاً، فريق <em>هرم.</em></h2>
          <p>كل تعديل تحفظه هنا يظهر بالموقع لكل الزوار مباشرة. من القائمة تگدر تعدّل كل نص، صورة، خدمة وعمل بالموقع.</p>
          <div className="actions">
            <button className="btn btn-ink" onClick={() => go('works', 'new')}>عمل جديد +</button>
            <button className="btn btn-line" onClick={() => go('texts')}>تعديل نصوص الصفحات</button>
            <a className="btn btn-line" href="/" target="_blank" rel="noopener">افتح الموقع ↗</a>
          </div>
        </div>
        <div className="pyr" dangerouslySetInnerHTML={{ __html: engravedPyramid({ id: 'dash' }) }} />
      </section>

      <section className="stats">
        <div className="card stat dark"><span className="lbl">الأعمال المنشورة</span><span className="v">{content.works.length}</span><span className="ic">{Icon.works}</span></div>
        <div className="card stat"><span className="lbl">أعمال مميزة</span><span className="v">{content.works.filter((w) => w.featured).length}</span><span className="ic">{Icon.star}</span></div>
        <div className="card stat"><span className="lbl">رسائل جديدة</span><span className="v">{unread}</span><span className="ic">{Icon.msg}</span></div>
        <div className="card stat"><span className="lbl">متابع إنستغرام</span><span className="v">{Number(content.settings.followers || 0).toLocaleString('en-US')}</span><span className="ic">{Icon.ig}</span></div>
      </section>

      <section className="two">
        <div className="card">
          <div className="card-head"><h2>الأعمال حسب التصنيف</h2><button className="link" onClick={() => go('categories')}>التصنيفات</button></div>
          <div className="bars">
            {counts.map(({ c, n }) => (
              <div className="bar-row" key={c.id}>
                <span>{t(c.name, 'ar')}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: grow ? `${(n / max) * 100}%` : 0 }} /></div>
                <b>{n}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h2>آخر الرسائل</h2><button className="link" onClick={() => go('messages')}>عرض الكل</button></div>
          {messages.length ? messages.slice(0, 4).map((m) => (
            <div className="msg-mini" key={m.id} onClick={() => go('messages', m.id)}>
              <span className={`av${m.read ? '' : ' unread'}`}>{initial(m.name)}</span>
              <div style={{ minWidth: 0 }}><b>{m.name}</b><p>{m.message || m.company}</p></div>
              <time>{ago(m.created_at)}</time>
            </div>
          )) : <p className="muted">ماكو رسائل بعد.</p>}
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-head"><h2>أحدث الأعمال</h2><button className="link" onClick={() => go('works')}>عرض الكل</button></div>
        <div className="recent">
          {content.works.slice(0, 3).map((w) => (
            <div className="mini-work" key={w.id} onClick={() => go('works', w.id)}>
              <div className="cv" dangerouslySetInnerHTML={{ __html: coverHTML(w, catEn(w.category)) }} />
              <b>{t(w.title, 'ar')}</b><span>{t(w.client, 'ar')} · {catName(w.category)}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
