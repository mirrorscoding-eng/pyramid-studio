'use client';

import { t } from '@/lib/content/defaults';
import type { Work } from '@/lib/content/types';
import { Media } from './Media';
import { PlayIcon } from './Svg';
import { useSite } from './SiteClient';

export function ReelCard({ w, catName, catEn, listIds }: { w: Work; catName: string; catEn: string; listIds: string[] }) {
  const { lang, openWork } = useSite();
  const title = t(w.title, lang);
  const client = t(w.client, lang);
  const meta = [client !== title ? client : '', w.year ? String(w.year) : ''].filter(Boolean).join(' · ') || catName;
  const open = () => openWork(w.id, listIds);
  return (
    <article
      className="reel reveal"
      tabIndex={0}
      role="button"
      aria-label={title}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
    >
      <div className="reel-cover">
        <Media w={w} catEn={catEn} mode="small" />
        {catName && <span className="chip">{catName}</span>}
        {w.featured && <span className="star" title="Featured">✦</span>}
        <span className="play"><PlayIcon /></span>
      </div>
      <div className="reel-meta"><h3>{title}</h3><p>{meta}</p></div>
    </article>
  );
}
