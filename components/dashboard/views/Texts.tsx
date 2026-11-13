'use client';

import { useState } from 'react';
import { TEXT_GROUPS } from '@/lib/content/labels';
import { DEFAULT_CONTENT } from '@/lib/content/defaults';
import { useDash, useDraft } from '../ctx';
import { SaveBar } from '../fields';

export function Texts() {
  const { content } = useDash();
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('texts');
  const [tab, setTab] = useState(TEXT_GROUPS[0].id);
  const [q, setQ] = useState('');
  const group = TEXT_GROUPS.find((g) => g.id === tab)!;
  const query = q.trim().toLowerCase();
  const fields = query
    ? TEXT_GROUPS.flatMap((g) => g.fields.map((f) => [...f, g.title] as const)).filter(([k, label]) =>
        [label, draft[k]?.ar, draft[k]?.en].join(' ').toLowerCase().includes(query))
    : group.fields.map((f) => [...f, group.title] as const);

  const set = (k: string, lang: 'ar' | 'en', v: string) => setDraft({ ...draft, [k]: { ...(draft[k] || { ar: '', en: '' }), [lang]: v } });
  const changed = (k: string, lang: 'ar' | 'en') => (draft[k]?.[lang] ?? '') !== (content.texts[k]?.[lang] ?? '');
  const restore = (k: string) => setDraft({ ...draft, [k]: { ...DEFAULT_CONTENT.texts[k] } });

  return (
    <>
      <div className="toolbar">
        <label className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input className="input" placeholder="دوّر على نص…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      {!query && (
        <div className="tabs" role="tablist">
          {TEXT_GROUPS.map((g) => (
            <button key={g.id} role="tab" aria-selected={tab === g.id} className={`tab${tab === g.id ? ' active' : ''}`} onClick={() => setTab(g.id)}>{g.title}</button>
          ))}
        </div>
      )}
      <div className="card">
        <div className="card-head">
          <div><h2>{query ? `نتائج البحث (${fields.length})` : group.title}</h2>{!query && <p className="muted" style={{ fontSize: 13.5 }}>{group.hint}</p>}</div>
        </div>
        <div className="t-group">
          {fields.map(([k, label, long, where]) => (
            <div className="t-row" key={k}>
              <span>
                {label}
                {query && <span className="key">{where}</span>}
                {DEFAULT_CONTENT.texts[k] && JSON.stringify(draft[k]) !== JSON.stringify(DEFAULT_CONTENT.texts[k]) && (
                  <button type="button" className="link" style={{ fontSize: 12, marginTop: 8, display: 'table' }} onClick={() => restore(k)}>رجوع للأصلي</button>
                )}
              </span>
              {(['ar', 'en'] as const).map((lang) => long ? (
                <textarea key={lang} className={`textarea${changed(k, lang) ? ' changed' : ''}`} dir={lang === 'en' ? 'ltr' : undefined} aria-label={`${label} ${lang}`}
                  value={draft[k]?.[lang] ?? ''} onChange={(e) => set(k, lang, e.target.value)} />
              ) : (
                <input key={lang} className={`input${changed(k, lang) ? ' changed' : ''}`} dir={lang === 'en' ? 'ltr' : undefined} aria-label={`${label} ${lang}`}
                  value={draft[k]?.[lang] ?? ''} onChange={(e) => set(k, lang, e.target.value)} />
              ))}
            </div>
          ))}
          {!fields.length && <p className="muted">ماكو نص يطابق البحث.</p>}
        </div>
      </div>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit()} onReset={reset} />
    </>
  );
}
