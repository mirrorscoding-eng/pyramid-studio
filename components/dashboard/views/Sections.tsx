'use client';

import { useState } from 'react';
import { SECTIONS } from '@/lib/content/sections';
import { useDash } from '../ctx';
import { VisToggle } from '../fields';

/** Switch whole page sections on and off. Each switch saves straight away. */
export function Sections() {
  const { content, save } = useDash();
  const [busy, setBusy] = useState('');
  const state = content.settings.sections || {};

  const toggle = async (key: string, label: string, on: boolean) => {
    setBusy(key);
    await save('settings', { ...content.settings, sections: { ...state, [key]: on } }, on ? `«${label}» صار ظاهر ✦` : `«${label}» انطفى`);
    setBusy('');
  };

  return (
    <>
      <p className="muted" style={{ fontSize: 13.5, marginBottom: 14 }}>كل قسم تطفيه يختفي من الصفحة فوراً لكل الزوار، ومحتواه يبقى محفوظ — شغّله بأي وقت ويرجع مثل ما كان.</p>
      <div className="sections-grid">
        {SECTIONS.map((p) => {
          const off = p.items.filter(([k]) => state[k] === false).length;
          return (
            <div className="card" key={p.page}>
              <div className="card-head">
                <div><h2>{p.title}</h2><p className="muted" style={{ fontSize: 13 }}>{off ? `${off} مطفي من ${p.items.length}` : 'كل الأقسام ظاهرة'}</p></div>
                <a className="link" href={p.path} target="_blank" rel="noopener">افتح الصفحة ↗</a>
              </div>
              {p.items.map(([key, label]) => {
                const on = state[key] !== false;
                return (
                  <div className={`sec-row${on ? '' : ' is-off'}`} key={key} style={busy === key ? { pointerEvents: 'none' } : undefined}>
                    <span>{label}</span>
                    <VisToggle on={on} label={label} onChange={(v) => toggle(key, label, v)} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
