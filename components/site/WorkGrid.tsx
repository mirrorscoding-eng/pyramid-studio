'use client';

import { useState } from 'react';
import { t } from '@/lib/content/defaults';
import type { Category, Work } from '@/lib/content/types';
import { ReelCard } from './ReelCard';
import { useSite } from './SiteClient';

export function WorkGrid({ works, categories, allLabel, emptyLabel }: { works: Work[]; categories: Category[]; allLabel: string; emptyLabel: string }) {
  const { lang } = useSite();
  const [filter, setFilter] = useState('all');
  const used = categories.filter((c) => works.some((w) => w.category === c.id));
  const current = filter !== 'all' && !used.find((c) => c.id === filter) ? 'all' : filter;
  const list = works.filter((w) => current === 'all' || w.category === current);
  const ids = list.map((w) => w.id);
  const name = (id: string, l = lang) => { const c = categories.find((x) => x.id === id); return c ? t(c.name, l) : ''; };

  return (
    <section className="sec" style={{ paddingTop: 50 }}><div className="container">
      {used.length > 1 && (
        <div className="filters reveal" style={{ marginBottom: 34 }}>
          <button className={`chip-btn${current === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>{allLabel} <small>{works.length}</small></button>
          {used.map((c) => (
            <button key={c.id} className={`chip-btn${current === c.id ? ' active' : ''}`} onClick={() => setFilter(c.id)}>
              {t(c.name, lang)} <small>{works.filter((w) => w.category === c.id).length}</small>
            </button>
          ))}
        </div>
      )}
      <div className="reels">
        {list.length ? list.map((w) => <ReelCard key={w.id} w={w} catName={name(w.category)} catEn={name(w.category, 'en')} listIds={ids} />) : <p className="empty">{emptyLabel}</p>}
      </div>
    </div></section>
  );
}
